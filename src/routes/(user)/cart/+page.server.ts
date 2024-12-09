import type { PageServerLoad } from './$types';
import { db } from "$lib/server/db"; // Adjust based on your DB configuration
import { customers, orders, product_variations } from "$lib/server/db/schema"; // Adjust based on your DB configuration
import { eq, and } from 'drizzle-orm';

import { fail, redirect } from '@sveltejs/kit';
import { randomBytes } from 'crypto';


function generateSessionId(): string {
    return randomBytes(32).toString('hex');
}

function getSessionExpiration(): Date {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 15); // Add 15 days
    return expirationDate;
}
export const actions = {
    ManageCheckoutLogin: async ({ cookies, request }) => {
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
                secure: false,
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
            throw redirect(302, '/cart');
        }

        // Fallback error if we somehow get here
        return fail(500, { error: 'Failed to complete login process.' });


    },
    ConfirmOrder: async ({ cookies, request }) => {
        const data = await request.formData();
        const co_name = data.get('co_name') as string || '';
        const co_phone = data.get('co_phone') as string || '';
        const co_address = data.get('co_address') as string || '';
        const co_email = data.get('co_email') as string || '';
        const delivery_notes = data.get('delivery_notes') as string || '';
        const userId = data.get('userId') as string || '';
        const cart = JSON.parse(data.get('cart') as string); // Parse the cart JSON string
    
        let totalAmount = 0;
    
        // Calculate total amount
        for (const item of cart) {
            const { variationId, quantity } = item;
    
            // Fetch price and discount for the variationId
            const productVariation = await db
                .select({
                    price: product_variations.price,
                    discount_percentage: product_variations.discount_percentage,
                })
                .from(product_variations)
                .where(eq(product_variations.id, variationId))
                .limit(1);
    
            // Safely handle discount_percentage
            if (productVariation.length > 0) {
                const { price, discount_percentage } = productVariation[0];
    
                // Ensure discount_percentage is not null and convert it to a number
                const discount = discount_percentage ? parseFloat(discount_percentage) : 0;
    
                // Calculate the discounted price
                const discountedPrice = price - (price * discount) / 100;
    
                // Accumulate the total amount
                totalAmount += discountedPrice * quantity;
            }
        }
    
        // Debugging: Log the total amount calculated
        console.log('Total Amount:', totalAmount);
    
        // Insert order into the database
        const order = await db.insert(orders).values({
            customer_id: parseInt(userId),
            orderData: cart,
            amount: totalAmount, // Set the calculated total amount
            co_phone: co_phone,
            co_name: co_name,
            co_address: co_address,
            co_email: co_email,
            delivery_notes: delivery_notes,
            payment_type: 'Pay on Delivery',
            order_status: 'Pending',
        }).$returningId();
    
        console.log('Order Inserted:', order); // Debugging: Log the inserted order
    
        return { success: true, orderId: order[0].id }; // Return a success response with the order ID
    }
    

};

export const load: PageServerLoad = async ({ locals }) => {

    return {
        user: locals.user
    };
};

