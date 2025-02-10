import type { PageServerLoad } from './$types';
import { db } from "$lib/server/db";
import { customers } from "$lib/server/db/schema";
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ url, cookies }) => {
    redirect(302, '/login');
};


function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
}

function isStrongPassword(password: string): boolean {
    return true;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

function generateSessionId(): string {
    return randomBytes(32).toString('hex');
}

function getSessionExpiration(): Date {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 15);
    return expirationDate;
}

export const actions = {
    newAccount: async ({ cookies, request }) => {
        const data = await request.formData();
        const phone = data.get('phone') as string || '';
        const password = data.get('password') as string || '';
        const confirmPassword = data.get('confirmPassword') as string || '';
        const email = data.get('email') as string || '';
        const name = data.get('name') as string || '';
        const gstin = data.get('gstin') as string || '';

        const address = data.get('address') as string || '';

        // Collect missing fields
        const missingFields: string[] = [];
        if (!phone) missingFields.push('phone');
        if (!password) missingFields.push('password');
        if (!confirmPassword) missingFields.push('confirmPassword');
        if (!name) missingFields.push('name');
        if (!address) missingFields.push('address');

        if (missingFields.length > 0) {
            return fail(400, {
                error: 'Missing required fields.',
                missingFields
            });
        }

        if (email && !isValidEmail(email)) {
            return fail(400, { error: 'Invalid email format.' });
        }

        if (!isValidPhone(phone)) {
            return fail(400, { error: 'Invalid phone number format.' });
        }

        if (password !== confirmPassword) {
            return fail(400, { error: 'Passwords do not match.' });
        }

        if (!isStrongPassword(password)) {
            return fail(400, {
                error: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number.'
            });
        }

        let newCustomerId: number | null = null;
        let sessionId: string | null = null;

        try {
            const existingCustomer = await db.select().from(customers).where(eq(customers.phone, phone)).limit(1);
            if (existingCustomer.length > 0) {
                return fail(400, { error: 'Account with this phone number already exists.' });
            }

            // Generate session data
            sessionId = generateSessionId();
            const sessionEOL = getSessionExpiration();

            // Insert new customer with session data
            const newCustomer = await db.insert(customers).values({
                name,
                email: email || null,
                phone,
                address,
                gstin,
                password, // Remember to hash the password before storing in production!
                sessionId,
                sessionEOL
            }).$returningId();

            newCustomerId = newCustomer[0].id;

            // Set session cookie
            cookies.set('sessionId', sessionId, {
                path: '/',
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 15
            });

            console.log('New customer created and logged in:', {
                id: newCustomerId,
                sessionId,
                sessionEOL
            });

        } catch (error) {
            console.error('Error creating account:', error);
            return fail(500, { error: 'Internal server error. Please try again later.' });
        }

        // Only redirect if we successfully created the customer and set the cookie
        if (newCustomerId && sessionId) {
            throw redirect(302, '/');
        }

        // If we somehow got here without success or an error, return a generic error
        return fail(500, { error: 'Failed to create account.' });
    }
};