import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db'; // Adjust based on your DB configuration
import { customers, orders, partners, product_variations } from '$lib/server/db/schema'; // Adjust based on your DB configuration
import { eq, and } from 'drizzle-orm';

import { fail, redirect } from '@sveltejs/kit';
import { instance } from '$lib/server/payments/razorpay';
import { randomBytes } from 'crypto';

function generateSessionId(): string {
	return randomBytes(32).toString('hex');
}

function getSessionExpiration(): Date {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 15); // Add 15 days
	return expirationDate;
}
export const actions = {
	ManageCheckoutLogin: async ({ cookies, request }) => {
		const data = await request.formData();
		const phone = (data.get('phone') as string) || '';
		const password = (data.get('password') as string) || '';

		// Validation
		if (!phone || !password) {
			return fail(400, {
				error: 'Phone and password are required.',
				missing: !phone ? 'phone' : 'password'
			});
		}

		let customerId: number | null = null;
		let sessionId: string | null = null;

		try {
			// Find the customer with matching credentials
			const customer = await db
				.select()
				.from(customers)
				.where(and(eq(customers.phone, phone), eq(customers.password, password)))
				.limit(1);

			console.log('Customer lookup result:', customer);

			if (customer.length === 0) {
				console.log('Invalid credentials');
				return fail(401, {
					error: 'Invalid credentials or account does not exist'
				});
			}

			// Generate new session
			sessionId = generateSessionId();
			const sessionEOL = getSessionExpiration();

			// Update customer with new session data
			await db
				.update(customers)
				.set({
					sessionId: sessionId,
					sessionEOL: sessionEOL
				})
				.where(eq(customers.id, customer[0].id));

			customerId = customer[0].id;

			// Set session cookie
			cookies.set('sessionId', sessionId, {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 15 // 15 days in seconds
			});

			console.log('Login successful:', {
				id: customerId,
				sessionId,
				sessionEOL
			});
		} catch (error) {
			console.error('Error during login:', error);
			return fail(500, { error: 'Internal server error. Please try again later.' });
		}

		// Only redirect if login and session creation were successful
		if (customerId && sessionId) {
			throw redirect(302, '/cart');
		}

		// Fallback error if we somehow get here
		return fail(500, { error: 'Failed to complete login process.' });
	},
	ConfirmOrder: async ({ cookies, request }) => {
		const data = await request.formData();
		const co_name = (data.get('co_name') as string) || '';
		const co_phone = (data.get('co_phone') as string) || '';
		const co_address = (data.get('co_address') as string) || '';
		const co_email = (data.get('co_email') as string) || '';
		const delivery_notes = (data.get('delivery_notes') as string) || '';
		const userId = (data.get('userId') as string) || '';
		const cart = JSON.parse(data.get('cart') as string); // Parse the cart JSON string

		const co_gstin = (data.get('co_gstin') as string) || '';
		const delivery_address = (data.get('delivery_address') as string) || '';
		const delivery_phone = (data.get('delivery_phone') as string) || '';
		const partner_code = (data.get('partner_code') as string) || '';
		const pincode = (data.get('pincode') as string) || '';

		let totalAmount = 0;

		// Calculate total amount
		for (const item of cart) {
			const { variationId, quantity } = item;

			// Fetch price and discount for the variationId
			const productVariation = await db
				.select({
					price: product_variations.price,
					discount_percentage: product_variations.discount_percentage
				})
				.from(product_variations)
				.where(eq(product_variations.id, variationId))
				.limit(1);

			// Safely handle discount_percentage
			if (productVariation.length > 0) {
				const { price, discount_percentage } = productVariation[0];

				// Ensure discount_percentage is not null and convert it to a number
				const discount = discount_percentage ? parseFloat(discount_percentage) : 0;

				// Calculate the discounted price
				const discountedPrice = price - (price * discount) / 100;

				// Accumulate the total amount
				totalAmount += discountedPrice * quantity;
			}
		}

		// Debugging: Log the total amount calculated
		console.log('Total Amount:', totalAmount);

		if (partner_code) {
			const partner = await db
				.select()
				.from(partners)
				.where(eq(partners.partner_code, partner_code))
				.limit(1);
			console.log(partner_code);
			console.log('Partner:', partner);
			if (partner.length === 0) {
				return fail(400, {
					error: 'Invalid Partner Code'
				});
			}

			// Apply partner discount

			const discount = partner[0].overall_discount ? parseFloat(partner[0].overall_discount) : 0;

			// Calculate the discounted price

			totalAmount = totalAmount - (totalAmount * discount) / 100;

			// Debugging: Log the total amount calculated

			console.log('Total Amount after partner discount:', totalAmount);
		}

		// Insert order into the database
		const order = await db
			.insert(orders)
			.values({
				customer_id: parseInt(userId),
				orderData: cart,
				amount: totalAmount, // Set the calculated total amount
				co_phone: co_phone,
				co_name: co_name,
				co_address: co_address,
				co_email: co_email,
				delivery_notes: delivery_notes,
				payment_type: 'Online Payment',
				order_status: 'Pending',
				co_gstin: co_gstin,
				delivery_address: delivery_address,
				delivery_phone: delivery_phone,
				partner_code: partner_code,
				pincode: parseInt(pincode)
			})
			.$returningId();

		console.log('Order Inserted:', order); // Debugging: Log the inserted order

		// Create Razorpay order
		const options = {
			amount: Math.round(totalAmount) * 100,
			currency: 'INR',
			receipt: order[0].id.toString()
		};
		const rzp_order = await instance.orders.create(options);
		console.log('Razorpay Order:', rzp_order); // Debugging: Log the Razorpay order
		return {
			success: true,
			lc_orderId: order[0].id,
			rzp_order_id: rzp_order.id,
			rzp_order_amount: Math.round(totalAmount) * 100
		}; // Return a success response with the order ID
	},

	DownloadQuote: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const phone = data.get('phone') as string;
		const email = data.get('email') as string;
		const gstin = data.get('gstin') as string;
		const address = data.get('address') as string;
		const partner_code = data.get('partner_code') as string;



		// Check if the partner code is valid and get the partner discount

		let discount = 0;

		if (partner_code) {
			const partner = await db
				.select()
				.from(partners)
				.where(eq(partners.partner_code, partner_code))
				.limit(1);

			if (partner.length === 0) {
				return fail(400, {
					origin: 'DownloadQuote',
					error: 'Invalid Partner Code'
				});
			}

			discount = partner[0].overall_discount ? parseFloat(partner[0].overall_discount) : 0;
		}

		// redirect to the quote download page with the details and discount percentage
		redirect(302, `/quote?customer_name=${name}&customer_phone=${phone}&email=${email}&gstin=${gstin}&customer_address=${address}&partner_code=${partner_code}&partner_overall_discount_percentage=${discount}`);
	
		
		
		
		
		
		
		
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user
	};
};
