<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let updateOrderModal: HTMLDialogElement;

	function openUpdateOrderModal() {
		updateOrderModal.showModal();
	}

	function closeUpdateOrderModal() {
		updateOrderModal.close();
	}
</script>

<section class="p-4">
	{#if !data.order}
		<p class="mt-4 text-center">Order not found, please go back.</p>
	{:else}
		<button
			class="btn w-full rounded-md px-4 py-2 font-semibold text-white"
			type="button"
			onclick={openUpdateOrderModal}
		>
			Click here to update order details
		</button>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-lg bg-white p-6">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold text-gray-800">Order #{data.order.id}</h2>
					<span class="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
						{data.order.order_status}
					</span>
				</div>
				<hr class="my-3" />
				<div class="space-y-2 text-sm text-gray-600">
					<p>
						<span class="font-semibold">Order Date:</span>
						{new Date(data.order.created_at).toLocaleDateString()}
					</p>
					<p><span class="font-semibold">Amount:</span> ₹{data.order.amount.toFixed(2)}</p>
					<p><span class="font-semibold">Payment Type:</span> {data.order.payment_type}</p>
					<p>
						<span class="font-semibold">Delivery Notes:</span>
						{data.order.delivery_notes || 'N/A'}
					</p>
					<p>
						<span class="font-semibold">Delivery Date:</span>
						{data.order.delivery_date
							? new Date(data.order.delivery_date).toLocaleDateString()
							: 'Not Scheduled'}
					</p>
				</div>
				<hr class="my-3" />
				<div class="text-sm text-gray-600">
					<h3 class="mb-2 font-semibold">Shipping Information</h3>
					<p>{data.order.co_name}</p>
					<p>{data.order.co_address}</p>
					<p>{data.order.co_phone}</p>
					{#if data.order.co_email}
						<p>{data.order.co_email}</p>
					{/if}
				</div>
				<hr class="my-3" />
				<div class="text-sm text-gray-600">
					<h3 class="mb-2 font-semibold">Order Items</h3>
					<ul class="space-y-2">
						{#each data.order.orderData as Array<{ id: number; name: string; type: string; color: string; thickness: number; length: number; quantity: number; price: number; discountedPrice?: number }> as item (item.id)}
							<li class="rounded-md bg-gray-100 p-3">
								<p class="font-semibold">{item.name} ({item.type})</p>
								<p class="text-sm">
									Color: {item.color} | Thickness: {item.thickness} | Length: {item.length}m
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
		</div>
	{/if}
</section>

<dialog
	id="checkoutLoginModal"
	class="modal modal-bottom sm:modal-middle"
	bind:this={updateOrderModal}
>
	<div class="modal-box">
		<h1 class="text-2xl">Update order details</h1>

		<form action="?/updateOrderDetails" method="post">
            <input type="text" name="orderId" value={data.order.id} hidden />
			<select class="select select-bordered mt-4 w-full" name="order_status" required>
				<option disabled selected>Status</option>
				<option value="pending">Pending</option>
				<option value="confirmed">Confirmed</option>

				<option value="processing">Processing</option>

				<option value="delivered">Delivered</option>
			</select>

			<label class="form-control mt-4 w-full">
				<div class="label">
					<span class="label-text">Date of delivery</span>
				</div>
				<input
					type="date"
					class="input input-bordered w-full"
					name="delivery_date"
					required
				/>
			</label>

			<div class="flex items-center justify-end">
				<button type="submit" class="btn mt-4 text-white"> Update Order </button>
			</div>
		</form>
	</div>
</dialog>

<style>
	button[type='button'],
	button[type='submit'] {
		background-color: #047857;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
	}
</style>
