import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { customers, otps } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

import { TFACTOR_API_KEY, SMS_OTP_TEMPLATE_NAME } from '$env/static/private';

export const actions: Actions = {
	validate: async ({ request, cookies }) => {
		const data = await request.formData();
		const phone = data.get('phone')?.toString().trim();

		if (!phone || phone.length !== 10) {
			return fail(400, {
				success: false,
				error: 'Please enter a valid 10-digit phone number.'
			});
		}

		const customer = await db.select().from(customers).where(eq(customers.phone, phone)).limit(1);

		if (!customer.length) {
			return fail(404, {
				success: false,
				error: "We couldn't find an account with that phone number."
			});
		}

		// https://2factor.in/API/V1/XXXX-XXXX-XXXX-XXXX-XXXX/SMS/+919999999999/12345/OTP1

		cookies.set('phone_pending_otp', phone, {
			path: '/',
			maxAge: 60 * 60 * 24 * 15
		});

		const otp = Math.floor(1000 + Math.random() * 9000);
		console.log('Generated OTP:', otp, 'for phone:', phone);
		try {
			await db.insert(otps).values({
				customer: customer[0].id,
				otp: otp.toString()
			});
		} catch (error) {
			console.error('Failed to insert OTP:', error);
			return fail(500, {
				success: false,
				error: 'Failed to send OTP. Please try again later.'
			});
		}
		const response = await fetch(
			`https://2factor.in/API/V1/${TFACTOR_API_KEY}/SMS/${phone}/${otp}/${SMS_OTP_TEMPLATE_NAME}`
		);

		const json = await response.json();

		if (json.Status === 'Success') {
			throw redirect(302, '/login/otp');
		}

		// try {
		// 	await db.insert(otps).values({
		// 		customer: customer[0].id,
		// 		otp: otp.toString()
		// 	});
		// } catch (error) {
		// 	console.error('Failed to insert OTP:', error);
		// 	return fail(500, {
		// 		success: false,
		// 		error: 'Failed to send OTP. Please try again later.'
		// 	});
		// }

		// throw redirect(302, '/login/otp');

		return fail(500, {
			success: false,
			error: 'Failed to send OTP. Please try again later.'
		});
	}
};
