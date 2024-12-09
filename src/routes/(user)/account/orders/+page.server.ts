import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    if (!locals.user) {
        throw new Error('User is not authenticated');
    }
    const c_orders = await db.select().from(orders).where(eq(orders.customer_id, locals.user.id));
    
    
    
    return {
        user: locals.user,
        orders: c_orders
    };
}) satisfies PageServerLoad;