<script lang="ts">
	// @ts-nocheck

	import PublicMenu from '$lib/components/PublicMenu.svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PublicMenu {data} currentPage={'orders'} />

<h1 class="mt-4 text-center text-2xl font-bold">Your Orders</h1>
<section class="p-2">
	{#if data.orders.length === 0}
		<p class="mt-4 text-center">You have no orders yet</p>
	{:else}
		<div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.orders as order}
				<div class="the-list-item rounded-lg bg-white p-6">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold text-gray-800">Order #{order.id}</h2>
						<span class="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
							{order.order_status}
						</span>
					</div>
					<hr class="my-3" />
					<div class="space-y-2 text-sm text-gray-600">
						<p>
							<span class="font-semibold">Order Date:</span>
							{new Date(order.created_at).toLocaleDateString()}
						</p>
						<p><span class="font-semibold">Amount:</span> ₹{order.amount.toFixed(2)}</p>
						<p><span class="font-semibold">Payment Type:</span> {order.payment_type}</p>
						<p>
							<span class="font-semibold">Delivery Notes:</span>
							{order.delivery_notes || 'N/A'}
						</p>
						<p>
							<span class="font-semibold">Delivery Date:</span>
							{order.delivery_date
								? new Date(order.delivery_date).toLocaleDateString()
								: 'Not Scheduled'}
						</p>
					</div>
					<hr class="my-3" />
					<div class="text-sm text-gray-600">
						<h3 class="mb-2 font-semibold">Shipping Information</h3>
						<p>{order.co_name}</p>
						<p>{order.co_address}</p>
						<p>{order.co_phone}</p>
						{#if order.co_email}
							<p>{order.co_email}</p>
						{/if}
					</div>
					<hr class="my-3" />
					<div class="text-sm text-gray-600">
						<h3 class="mb-2 font-semibold">Ordered Items</h3>
						<ul class="space-y-2">
							{#each order.orderData as item}
								<li class="rounded-md bg-gray-100 p-3">
									<!-- <p class="font-semibold">{item.name} ({item.type})</p> -->
									<p class="font-semibold">{item.name}</p>

									<p class="text-sm">
										<!-- Color: {item.color} | Thickness: {item.thickness} | Length: {item.length}m -->
										Color: {item.color} | Thickness: {item.thickness}
									</p>
									<p class="text-sm">Quantity: {item.quantity}</p>
									<p class="text-sm">
										Price: ₹{item.price.toFixed(2)}
										{#if item.discountedPrice}
											(Discounted: ₹{item.discountedPrice.toFixed(2)})
										{/if}
									</p>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	.grid > div {
		background-color: #f9fafb;
		border-radius: 10px;
		padding: 1.5rem;
	}
	ul > li {
		background-color: #e5e7eb;
		border-radius: 8px;
		padding: 0.75rem;
	}

	.the-list-item {
		border: 1px solid #e5e7eb;
	}
</style>
