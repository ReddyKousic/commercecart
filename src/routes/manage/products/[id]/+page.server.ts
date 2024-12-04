import { db } from '$lib/server/db';
import { products, product_variations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
        throw error(400, 'Invalid product ID');
    }


    // this is how to write a filter query await db.select().from(users).where(eq(users.id, 42));

    const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);




    if (!product) {
        throw error(404, 'Product not found');
    }

    // const variations = await db.query.product_variations.findMany({
    //     where: eq(product_variations.product_id, productId),
    // });

    const variations = await db.select().from(product_variations).where(eq(product_variations.product_id, productId));
    console.log(product);
    return {
        product,
        variations
    };
};