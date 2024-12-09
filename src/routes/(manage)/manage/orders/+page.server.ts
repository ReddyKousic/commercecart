import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db'; // Adjust this path to your database setup
import { orders, customers } from '$lib/server/db/schema'; // Adjust this path to your database setup
import { desc, sql } from 'drizzle-orm';


export const load: PageServerLoad = async () => {
	// Fetch all orders from the database
	const orderData = await db
		.select()
		.from(orders)
		.orderBy(desc(orders.created_at));

	return { orders: orderData };
};
