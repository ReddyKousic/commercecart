import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { customers, otps } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

import { TFACTOR_API_KEY, SMS_OTP_TEMPLATE_NAME, NODE_ENV } from '$env/static/private';
export const load: PageServerLoad = async ({ url, cookies }) => {
	const redirectPath = url.searchParams.get('redirect');

	if (redirectPath) {
		cookies.set('redirect_after_login', redirectPath, {
			path: '/',
			maxAge: 60 * 5,
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'lax'
		});
	}
};

export const actions: Actions = {
	validate: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const phone = formData.get('phone')?.toString().trim();

		if (!phone || phone.length !== 10) {
			return fail(400, { error: 'Please enter a valid 10-digit phone number.' });
		}

		let customer = await db.select().from(customers).where(eq(customers.phone, phone)).limit(1);

		if (!customer.length) {
			try {
				customer = await db.insert(customers).values({ phone }).$returningId();
			} catch (error) {
				console.error('Failed to create customer:', error);
				return fail(500, { error: 'Failed to create account. Please try again later.' });
			}
		}

		cookies.set('phone_pending_otp', phone, {
			path: '/',
			maxAge: 60 * 60 * 24 * 15, // 15 days
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'lax'
		});

		const otp = Math.floor(1000 + Math.random() * 9000);
		console.log('Generated OTP:', otp, 'for phone:', phone);

		try {
			await db.insert(otps).values({ customer: customer[0].id, otp: otp.toString() });
		} catch (error) {
			console.error('Failed to insert OTP:', error);
			return fail(500, { error: 'Failed to generate OTP. Please try again later.' });
		}

		if (NODE_ENV === 'production') {
			try {
				const response = await fetch(
					`https://2factor.in/API/V1/${TFACTOR_API_KEY}/SMS/${phone}/${otp}/${SMS_OTP_TEMPLATE_NAME}`
				);

				const json = await response.json();

				if (json.Status !== 'Success') {
					console.error('2Factor API Error:', json);
					return fail(500, { error: 'Failed to send OTP. Please try again later.' });
				}
			} catch (error) {
				console.error('Error sending OTP via 2Factor:', error);
				return fail(500, { error: 'Failed to send OTP. Please try again later.' });
			}
		} else {
			console.log('OTP not sent in development mode. OTP is:', otp);
		} // Redirect to /login/otp with preserved redirect param if it exists
		throw redirect(302, `/login/otp`);
	}
};
