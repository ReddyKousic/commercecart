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
			const name = formData.get('name') || '';
			const description = formData.get('description');
			const selling_status = formData.get('selling_status') || 'active';
			const variations = formData.get('variations');

			const is_isolated = formData.get('isolated') === 'true';

			const isolated_discount_percentage =
				Number(formData.get('isolated_discount_percentage')) || 0;
			const isolated_price = Number(formData.get('isolated_price')) || 0;

			console.log(formData);

			// Isolated product
			if (is_isolated && isolated_discount_percentage !== 0 && isolated_price !== 0) {
				console.log('Isolated:', is_isolated);

				// Insert product

				const [newProduct] = await db
					.insert(products)
					.values({
						name: name.toString(),
						description: description?.toString() || '',
						selling_status: selling_status.toString(),
						is_isolated: true
					})
					.$returningId();

				// Insert variations

				console.log('newProduct:', newProduct);

				await db.insert(product_variations).values({
					product_id: newProduct.id,
					thickness: 'Isolated',
					price: Number(isolated_price),
					discount_percentage: isolated_discount_percentage.toString() || '0'
				});

				return { success: true };
			}

			if (!name || !selling_status || !variations) {
				console.error('Missing required fields:', { name, selling_status, variations });
				return fail(400, {
					error: 'Missing required fields. Please ensure all fields are filled.'
				});
			}

			// Insert product
			const [newProduct] = await db
				.insert(products)
				.values({
					name: name.toString(),
					description: description?.toString() || '',
					selling_status: selling_status.toString()
				})
				.$returningId();

			// Insert variations
			const variationsData = JSON.parse(variations.toString());
			await db.insert(product_variations).values(
				variationsData.map((v: any) => ({
					product_id: newProduct.id,
					color: v.color,
					// length: parseInt(v.length),
					// type: v.type,
					thickness: v.thickness,
					price: parseInt(v.price),
					discount_percentage: parseFloat(v.discount_percentage) || 0
				}))
			);

			return { success: true };
		} catch (error) {
			console.error('Error:', error);
			return fail(500, { error: 'Failed to add product due to server error.' });
		}
	}
};
