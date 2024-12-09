// buy/[id]/+page.server.ts

import { db } from "$lib/server/db"; // Adjust based on your DB configuration
import { products, product_variations } from "$lib/server/db/schema"; // Adjust based on your DB configuration
import { eq } from 'drizzle-orm';

export async function load({ params, locals }) {
  const productId = Number(params.id);

  // Fetch product and variations from the database
  const product = await db.select().from(products).where(eq(products.id, productId));

  const variations = await db.select().from(product_variations).where(eq(product_variations.product_id, productId));

  if (!product) {
    throw new Error("Product not found.");
  }

  return {
    product,
    variations,
    user: locals.user,
  };
}
