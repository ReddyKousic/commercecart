import type { RequestHandler } from './$types';
import { db } from '$lib/server/db'; // Adjust this path to your database setup
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ params, request }) => {
    const orderId = parseInt(params.id, 10);
    if (isNaN(orderId)) {
        return new Response('Invalid order ID', { status: 400 });
    }

    const body = await request.json();
    const { status, delivery_date } = body;

    // Update order in the database
    try {
        await db
            .update(orders)
            .set({
                order_status: status || undefined,
                delivery_date: delivery_date ? new Date(delivery_date) : undefined,
            })
            .where(eq(orders.id, orderId));

        return new Response('Order updated successfully', { status: 200 });
    } catch (error) {
        console.error('Error updating order:', error);
        return new Response('Failed to update order', { status: 500 });
    }
};
