import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw new Error('User is not authenticated');
	}
	const c_orders = await db
		.select()
		.from(orders)
		.where(eq(orders.customer_id, Number(locals.user.id)))
		.orderBy(desc(orders.created_at));
	return {
		user: locals.user,
		orders: c_orders
	};
}) satisfies PageServerLoad;
