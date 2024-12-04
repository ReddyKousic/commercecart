import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH({ request, params }) {
    const productId = parseInt(params.id);
    const data = await request.json();
    
    await db.update(products)
        .set(data)
        .where(eq(products.id, productId));
        
    return json({ success: true });
}