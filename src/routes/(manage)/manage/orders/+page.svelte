<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="mb-2 mt-4 text-center text-2xl font-bold">Manage Orders</h1>

{#if data.orders.length === 0}
	<p class="mt-4 text-center">You have no orders yet</p>
{:else}
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-2">
		{#each data.orders as order}
			<a href="/manage/orders/{order.id}">
				<div class="rounded-lg bg-white p-6 transition-transform the-list-item">
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
						<h3 class="mb-2 font-semibold">Order Items</h3>
						<ul class="space-y-2">
							{#each order.orderData as item}
								<li class="rounded-md bg-gray-100 p-3">
									<p class="font-semibold">{item.name}</p>
									<p class="text-sm">
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
			</a>
		{/each}
	</div>
{/if}


<style>
	.the-list-item {
		border: 1px solid #e2e8f0;
	}
</style>