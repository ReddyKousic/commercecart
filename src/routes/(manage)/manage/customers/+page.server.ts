import type { PageServerLoad } from './$types';

import { error, fail, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { customers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async () => {
    const customers_data = await db.select({ id: customers.id, name: customers.name, email: customers.email, phone: customers.phone, address: customers.address }).from(customers);
    console.log(customers_data);
    return {
        customers: customers_data
    };
}) satisfies PageServerLoad;