<script>
	import Footer from "$lib/components/Footer.svelte";

	const currentYear = new Date().getFullYear();
</script>

<main class="container mx-auto px-4 py-8">
	<section class="rounded-lg bg-base-100 p-6">
		<h1 class="mb-4 text-3xl font-bold">Cancellation and Return Policy</h1>
		<p class="mb-6">
			At <strong>WIREGUY</strong>, we prioritize customer satisfaction and aim to make your
			experience as smooth as possible. Please review our cancellation and return policy for details
			on how to manage your orders.
		</p>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">1. Order Cancellation</h2>
		<h3 class="mb-2 mt-4 text-xl font-medium">1.1 Before Shipment:</h3>
		<ul class="mb-4 ml-6 list-disc">
			<li>
				Orders can be canceled free of charge if the request is made within 6 hours of placing the
				order or before the item has been shipped.
			</li>
			<li>
				To cancel your order, contact us at <strong>askwaasim@gmail.com</strong> or
				<strong>+91 7799882883</strong>.
			</li>
		</ul>

		<h3 class="mb-2 mt-4 text-xl font-medium">1.2 After Shipment:</h3>
		<ul class="mb-4 ml-6 list-disc">
			<li>
				If your order has already been shipped, it cannot be canceled. However, you may initiate a
				return after delivery as per our return policy.
			</li>
			<li>Shipping fees for the returned order will be non-refundable.</li>
		</ul>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">2. Return Policy</h2>
		<h3 class="mb-2 mt-4 text-xl font-medium">2.1 Eligibility for Returns</h3>
		<ul class="mb-4 ml-6 list-disc">
			<li>Returns are accepted within 3 days of delivery.</li>
			<li>
				Products must be in their original condition, unused, and in the original packaging, with
				all tags and labels intact.
			</li>
			<li>Returns are only applicable for defective, damaged, or incorrect items.</li>
		</ul>

		<h3 class="mb-2 mt-4 text-xl font-medium">2.2 Non-Returnable Items</h3>
		<p class="mb-4">The following items are not eligible for return:</p>
		<ul class="mb-4 ml-6 list-disc">
			<li>Custom-made or special-order items.</li>
			<li>Products that have been used, installed, or altered.</li>
		</ul>

		<h3 class="mb-2 mt-4 text-xl font-medium">2.3 How to Initiate a Return</h3>
		<ul class="mb-4 ml-6 list-disc">
			<li>
				Contact us at <strong>wireguy.in@gmail.com</strong> or <strong>+91 7799882883</strong> with your
				order number, reason for the return, and supporting photos.
			</li>
			<li>
				Once your return request is approved, we will provide you with a return authorization and
				instructions on how to ship the item back to us.
			</li>
		</ul>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">3. Refunds</h2>
		<h3 class="mb-2 mt-4 text-xl font-medium">3.1 Refund Process</h3>
		<ul class="mb-4 ml-6 list-disc">
			<li>Refunds will be initiated after we receive and inspect the returned product.</li>
			<li>Refunds will be processed to the original payment method used during the purchase.</li>
		</ul>

		<h3 class="mb-2 mt-4 text-xl font-medium">3.2 Refund Timelines</h3>
		<ul class="mb-4 ml-6 list-disc">
			<li>Refunds typically take 7-14 business days to reflect in your account after approval.</li>
			<li>
				Shipping charges and handling fees are non-refundable, except for defective or incorrect
				items.
			</li>
		</ul>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">4. Exchange Policy</h2>
		<p class="mb-4">
			If you receive a defective or incorrect item and wish to exchange it, please contact us within
			3 days of delivery.
		</p>
		<p class="mb-4">Exchanges are subject to product availability.</p>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">5. Damaged or Incorrect Items</h2>
		<p class="mb-4">
			If your product arrives damaged or incorrect, please notify us within 3 days of delivery with
			photos of the damage or discrepancy.
		</p>
		<p class="mb-4">We will arrange for a replacement or refund at no additional cost.</p>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">6. Contact Us</h2>
		<p class="mb-4">
			For cancellations, returns, or exchanges, please reach out to our customer support team:
		</p>
		<ul class="mb-4 ml-6 list-disc">
			<li><strong>Email:</strong> wireguy.in@gmail.com</li>
			<li><strong>Phone:</strong> +91 7799882883</li>
		</ul>

		<p class="mt-6">
			We appreciate your understanding and cooperation as we work to resolve your concerns
			efficiently. Thank you for choosing <strong>WIREGUY</strong>!
		</p>
	</section>
</main>
<Footer />
