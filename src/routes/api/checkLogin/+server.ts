// /api/checkLogin/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from "$lib/server/db";
import { customers } from "$lib/server/db/schema";
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ cookies }) => {
    const sessionId = cookies.get('sessionId');

    if (!sessionId) {
        return json({
            loggedIn: false,
            message: 'No session found'
        });
    }

    try {
        // Find customer with valid session
        const customer = await db.select({
            id: customers.id,
            name: customers.name,
            phone: customers.phone,
            email: customers.email,
            sessionEOL: customers.sessionEOL,
            address: customers.address
        })
            .from(customers)
            .where(eq(customers.sessionId, sessionId))
            .limit(1);

        if (customer.length === 0 ) {
            return json({
                loggedIn: false,
                message: 'Invalid session'
            });
        }

        // Check if session has expired
        const sessionEOL = customer[0].sessionEOL ? new Date(customer[0].sessionEOL) : null;
        if (sessionEOL && sessionEOL < new Date()) {
            return json({
                loggedIn: false,
                message: 'Session expired'
            });
        }

        // Return customer data without sensitive information
        return json({
            loggedIn: true,
            customer: {
                id: customer[0].id,
                name: customer[0].name,
                phone: customer[0].phone,
                email: customer[0].email,
                address: customer[0].address
            }
        });

    } catch (error) {
        console.error('Error checking login status:', error);
        return json({
            loggedIn: false,
            message: 'Error checking login status'
        }, { status: 500 });
    }
};