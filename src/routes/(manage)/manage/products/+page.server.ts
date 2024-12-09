
import { db } from '$lib/server/db'; // Assuming you have your db connection configured in lib/db
import { products } from '$lib/server/db/schema'; // Assuming your schema is in lib/schema
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allProducts = await db.select().from(products);
    
    return {
        products: allProducts
    };
};