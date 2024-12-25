import type { PageServerLoad } from './$types';
import { db } from "$lib/server/db";
import { customers } from "$lib/server/db/schema";
import { eq, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { env } from '$env/dynamic/private';

function generateSessionId(): string {
    return randomBytes(32).toString('hex');
}

function getSessionExpiration(): Date {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 15); // Add 15 days
    return expirationDate;
}

export const actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const phone = data.get('phone') as string || '';
        const password = data.get('password') as string || '';


        // Validation
        if (!phone || !password) {
            return fail(400, {
                error: 'Phone and password are required.',
                missing: !phone ? 'phone' : 'password'
            });
        }

        let customerId: number | null = null;
        let sessionId: string | null = null;

        try {
            // Find the customer with matching credentials
            const customer = await db.select()
                .from(customers)
                .where(
                    and(
                        eq(customers.phone, phone),
                        eq(customers.password, password)
                    )
                )
                .limit(1);

            console.log('Customer lookup result:', customer);

            if (customer.length === 0) {
                console.log('Invalid credentials');
                return fail(401, {
                    error: 'Invalid credentials or account does not exist',
                });
            }

            // Generate new session
            sessionId = generateSessionId();
            const sessionEOL = getSessionExpiration();

            // Update customer with new session data
            await db.update(customers)
                .set({
                    sessionId: sessionId,
                    sessionEOL: sessionEOL
                })
                .where(eq(customers.id, customer[0].id));

            customerId = customer[0].id;

            // Set session cookie
            cookies.set('sessionId', sessionId, {
                path: '/',
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 15 // 15 days in seconds
            });

            console.log('Login successful:', {
                id: customerId,
                sessionId,
                sessionEOL
            });

        } catch (error) {
            console.error('Error during login:', error);
            return fail(500, { error: 'Internal server error. Please try again later.' });
        }

        // Only redirect if login and session creation were successful
        if (customerId && sessionId) {
            throw redirect(302, '/');
        }

        // Fallback error if we somehow get here
        return fail(500, { error: 'Failed to complete login process.' });
    }
};