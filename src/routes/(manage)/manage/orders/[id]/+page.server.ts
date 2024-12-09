import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';


export let actions: Actions = {
    updateOrderDetails : async ({params, request}) => {
        // const orderId = parseInt(params.id);
        const formData = await request.formData();
        const order_id = parseInt(formData.get('orderId') as string);
        const status = formData.get('order_status');
        const delivery_date = formData.get('delivery_date');

        if (!order_id || !status || !delivery_date) {
            console.error('Missing required fields:', { order_id, status, delivery_date });
            return fail(400, {
                error: 'Missing required fields. Please ensure all fields are filled.',
            });
        }

        // Update order

        await db.update(orders).set({
            order_status: status.toString(),
            delivery_date: new Date(delivery_date.toString()),
        }).where(eq(orders.id, order_id));

        return { success: true };
        

    }
};


export const load = (async ({params}) => {
    const orderId = parseInt(params.id);
    
    if (isNaN(orderId)) {
        throw error(400, 'Invalid order ID');
    }

    const order = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

    if (!order) {
        throw error(404, 'Order not found');
    }


    
    return {
        order: order[0]
    };
}) satisfies PageServerLoad;