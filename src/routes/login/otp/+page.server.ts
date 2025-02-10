import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { NODE_ENV } from '$env/static/private';
import { customers, otps } from '$lib/server/db/schema';
import { randomBytes } from 'crypto';

export const load = (async ({ cookies }) => {
	console.log('Cookies:', cookies.getAll());
	return {
		phone: cookies.get('phone_pending_otp') || ''
	};
}) satisfies PageServerLoad;
function generateSessionId(): string {
	return randomBytes(32).toString('hex');
}

function getSessionExpiration(): Date {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 15); // Add 15 days
	return expirationDate;
}
export const actions: Actions = {
	verify: async ({ request, cookies }) => {
		const data = await request.formData();
		const otp = data.get('otp')?.toString().trim();
		const phone = cookies.get('phone_pending_otp');

		if (!otp || otp.length !== 4) {
			return fail(400, {
				success: false,
				error: 'Invalid OTP. Please enter a 4-digit OTP.'
			});
		}

		const otpRecord = await db.select().from(otps).where(eq(otps.otp, otp)).limit(1);

		const otpFullRecord = await db
			.select()
			.from(customers)
			.rightJoin(otps, eq(customers.id, otps.customer))
			.where(eq(otps.otp, otp))
			.limit(1);
		console.log(otpFullRecord);

		if (otpRecord.length === 0 || otpFullRecord.length === 0) {
			return fail(404, {
				success: false,
				error: 'Invalid OTP. Please try again.'
			});
		}

		if (otpRecord[0].created_at < new Date(Date.now() - 5 * 60 * 1000)) {
			return fail(400, {
				success: false,
				error: 'OTP expired. Please try to login again.'
			});
		}

		const sessionId = generateSessionId();
		const sessionEOL = getSessionExpiration();

		// Update customer with new session data
		await db
			.update(customers)
			.set({
				sessionId: sessionId,
				sessionEOL: sessionEOL
			})
			.where(eq(customers.id, otpFullRecord[0].customers.id));

		const customerId = otpFullRecord[0].customers.id;

		// Set session cookie
		cookies.set('sessionId', sessionId, {
			path: '/',
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 15 // 15 days in seconds
		});

		// Get redirect path from the cookie (if exists)
		const redirectPath = cookies.get('redirect_after_login') || '/';

		// Clear the redirect cookie after use
		cookies.delete('redirect_after_login', {
			path: '/',
			maxAge: 60 * 5,
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'lax'
		});

		console.log('Login successful:', {
			id: customerId,
			sessionId,
			sessionEOL,
			redirectPath
		});

		if (customerId && sessionId) {
			throw redirect(302, redirectPath);
		}
	}
} satisfies Actions;
