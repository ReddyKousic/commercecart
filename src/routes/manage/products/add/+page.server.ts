// src/routes/products/add/+page.server.ts
import { products, product_variations } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();

            // Validate required fields
            const name = formData.get('name');
            const description = formData.get('description');
            const selling_status = formData.get('selling_status');
            const variations = formData.get('variations');

            if (!name || !selling_status || !variations) {
                console.error('Missing required fields:', { name, selling_status, variations });
                return fail(400, {
                    error: 'Missing required fields. Please ensure all fields are filled.',
                });
            }

            // Insert product
            const [newProduct] = await db
                .insert(products)
                .values({
                    name: name.toString(),
                    description: description?.toString() || '',
                    selling_status: selling_status.toString(),
                })
                .$returningId();

            // Insert variations
            const variationsData = JSON.parse(variations.toString());
            await db.insert(product_variations).values(
                variationsData.map((v: any) => ({
                    product_id: newProduct.id,
                    color: v.color,
                    length: parseInt(v.length),
                    type: v.type,
                    price: parseInt(v.price),
                }))
            );

            return { success: true };
        } catch (error) {
            console.error('Error:', error);
            return fail(500, { error: 'Failed to add product due to server error.' });
        }
    },
};
