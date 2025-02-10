// /api/products/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products, product_variations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH({ request, params }) {
	const productId = parseInt(params.id);
	const data = await request.json();

	await db.update(products).set(data).where(eq(products.id, productId));

	return json({ success: true });
}

export async function GET({ params }) {
	const productId = parseInt(params.id);

	// Fetch product and its variations from database
	// const product = await db.select().from(products).where(products.id.eq(productId)).first();
	const product = await db.select().from(products).where(eq(products.id, productId));

	const variations = await db
		.select()
		.from(product_variations)
		.where(eq(product_variations.product_id, productId));

	if (!product) {
		return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
	}

	return new Response(JSON.stringify({ product, variations }), {
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function DELETE({ params }) {
  const productId = parseInt(params.id);

  try {
      // 1. Delete related product variations
      await db.delete(product_variations).where(eq(product_variations.product_id, productId)).execute();

      // 2. Delete the product
      const result = await db.delete(products).where(eq(products.id, productId)).execute();

      // 3. Check result.affected (or result.changes if using mysql2 driver)
      if (result && (result.affected !== undefined ? result.affected : result.changes) === 0) { // Check both affected and changes for compatibility
          return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
      }

      return json({ success: true, message: 'Product deleted successfully' });

  } catch (error) {
      console.error('Error deleting product:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete product' }), { status: 500 });
  }
}