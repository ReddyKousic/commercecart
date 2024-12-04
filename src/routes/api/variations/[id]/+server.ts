import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { product_variations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH({ request, params }) {
    const variationId = parseInt(params.id);
    const { price } = await request.json();
    
    await db.update(product_variations)
        .set({ price })
        .where(eq(product_variations.id, variationId));
        
    return json({ success: true });
}