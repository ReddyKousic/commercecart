<script>
	import Footer from '$lib/components/Footer.svelte';

	const currentYear = new Date().getFullYear();
</script>

<main class="container mx-auto px-4 py-8">
	<section class="rounded-lg bg-base-100 p-6 ">
		<h1 class="mb-4 text-3xl font-bold">Shipping Policy</h1>
		<p class="mb-6">
			At <strong>WIREGUY</strong>, we are committed to delivering your orders promptly and securely.
			Below is an outline of our shipping policy to help you understand how we manage the delivery
			process.
		</p>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">1. Shipping Locations</h2>
		<ul class="mb-4 ml-6 list-disc">
			<li>We ship to all locations within Andhra Pradesh and Telangana.</li>
			<li>
				For states other than AP & TG, please contact us directly at <strong
					>wireguy.in@gmail.com</strong
				>
				or <strong>+91 7799881882</strong> to check availability and delivery options.
			</li>
		</ul>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">2. Processing Time</h2>
		<ul class="mb-4 ml-6 list-disc">
			<li>
				Orders are processed within <strong>[1-3 business days]</strong> after payment is received.
			</li>
			<li>Orders placed on weekends or holidays will be processed on the next business day.</li>
		</ul>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">3. Shipping Methods and Delivery Time</h2>
		<ul class="mb-4 ml-6 list-disc">
			<li>
				Standard Shipping (for domestic orders): Delivery within <strong>[1-7 business days]</strong
				>.
			</li>
			<li>
				Freight Shipping (for bulk/industrial orders): Delivery time will depend on the order size
				and destination.
			</li>
			<li>
				Delivery times may vary based on the destination, carrier delays, or unforeseen
				circumstances.
			</li>
		</ul>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">4. Shipping Charges</h2>
		<ul class="mb-4 ml-6 list-disc">
			<li>
				Shipping fees are calculated based on the weight, dimensions, and destination of your order.
			</li>
			<li>
				Any applicable taxes, customs duties, or fees for international shipments will be the
				responsibility of the customer.
			</li>
		</ul>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">5. Order Tracking</h2>
		<p class="mb-4">
			Once your order has been shipped, we will provide a tracking number via email or SMS to help
			you monitor your delivery status.
		</p>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">6. Damaged or Lost Shipments</h2>
		<ul class="mb-4 ml-6 list-disc">
			<li>
				If your shipment arrives damaged, please contact us within 3 days of delivery with photos of
				the damaged package and items.
			</li>
			<li>
				In case of a lost shipment, contact us at <strong>wireguy.in@gmail.com</strong> or
				<strong>+91 7799882883</strong> so we can assist you in filing a claim with the shipping carrier.
			</li>
		</ul>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">7. Undeliverable or Returned Packages</h2>
		<p class="mb-4">
			If a package is returned to us due to an incorrect address or inability to deliver, we will
			contact you to arrange reshipping. Additional shipping fees may apply.
		</p>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">8. Bulk and Special Orders</h2>
		<p class="mb-4">
			For bulk orders or special shipping requests, please reach out to us at <strong
				>wireguy.in@gmail.com</strong
			>
			or <strong>+91 7799881882</strong> to discuss options and delivery timelines.
		</p>

		<h2 class="mb-2 mt-6 text-2xl font-semibold">9. Contact Us</h2>
		<p class="mb-4">
			If you have any questions or concerns regarding shipping, feel free to contact us at:
		</p>
		<ul class="mb-4 ml-6 list-disc">
			<li><strong>Email:</strong> wireguy.in@gmail.com</li>
			<li><strong>Phone:</strong> +91 7799881882, 7799882883</li>
		</ul>

		<p class="mt-6">
			Thank you for choosing <strong>WIREGUY</strong>. We appreciate your trust and look forward to
			serving you!
		</p>
	</section>
</main>

<Footer />
