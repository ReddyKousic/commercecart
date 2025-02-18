import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    return {
        user: locals.user,
    };
}) satisfies PageServerLoad;