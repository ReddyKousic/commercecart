import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { RAZORPAY_SECRET } from '$env/static/private';
import crypto from 'crypto';
export async function PATCH({ request }) {
	const data = await request.json();

	if (
		!data.lc_orderId ||
		!data.razorpay_payment_id ||
		!data.razorpay_order_id ||
		!data.razorpay_signature
	) {
		return json({ success: false, error: 'Inconsistent data received!' });
	}

	const sha = crypto.createHmac('sha256', RAZORPAY_SECRET);
	sha.update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`);
	const digest = sha.digest('hex');
	console.log(`digest: ${digest}  data.razorpay_signature: ${data.razorpay_signature}`);

	if (digest !== data.razorpay_signature) {
		return json({ success: false, error: 'Signature mismatch!', error_code: 'AFP-F-002' });
	} else {
		try {
			await db
				.update(orders)
				.set({
					order_status: 'Payment Received',
					payment_status: 'Paid',
					razorpay_payment_id: data.razorpay_payment_id,
					razorpay_order_id: data.razorpay_order_id,
					razorpay_signature: data.razorpay_signature
				})
				.where(eq(orders.id, data.lc_orderId));
		} catch (e) {
			return json({ success: false, error: e, error_code: 'AFP-F-001' });
		}
	}

	return json({ success: true });
}
