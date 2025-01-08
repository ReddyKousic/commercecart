<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	let cart = [];

	onMount(() => {
		const storedCart = localStorage.getItem('cart');
		cart = storedCart ? JSON.parse(storedCart) : [];
	});

	function removeFromCart(index) {
		// Remove item reactively
		cart = cart.filter((_, i) => i !== index);
		localStorage.setItem('cart', JSON.stringify(cart));

		window.location.reload();
	}

	function updateCartQuantity(index, newQuantity) {
		// Update item quantity reactively
		cart[index].quantity = newQuantity;
		cart = [...cart]; // Trigger Svelte reactivity
		localStorage.setItem('cart', JSON.stringify(cart));
	}
</script>

<!-- Cart -->
<!-- <hr class="mb-4 mt-4" /> -->
<div class="px-4 py-4">
	<h2 class="cart-title text-xl font-bold">Cart</h2>
	{#if cart.length === 0}
		<p class="text-gray-500">
			Your cart is empty. Add items to the cart to order or download the quote.
		</p>
	{:else}
		<!-- Cart Total -->
		<div class="mb-6 border-b pt-4">
			<div class="flex items-center justify-between">
				<span class="text-gray-600">Subtotal ({cart.length} item(s)):</span>
				<span class="text-xl font-bold">
					₹{cart.reduce((total, item) => total + item.discountedPrice * item.quantity, 0).toFixed(2)}
				</span>
			</div>
		</div>

		<ul class="mt-4 space-y-4">
			{#each cart as item, index}
				<li class="flex items-center justify-between rounded border p-4">
					<div class="flex-grow">
						<p class="font-semibold">{item.name}</p>
						<p class="text-gray-600">
							<!-- {item.color}, {item.length} meters, {item.type}, {item.thickness} -->
							{item.color}, {item.thickness}

						</p>
						<div class="mt-1 text-gray-600">
							<span class="line-through text-sm text-gray-400">₹{item.price}</span>
							<span class="ml-2 text-red-600">₹{item.discountedPrice}</span>
							<span> × {item.quantity} = </span>
							<span class="font-semibold text-black">₹{(item.discountedPrice * item.quantity).toFixed(2)}</span>
						</div>
					</div>
					<div class="ml-4 flex items-center gap-2">
						<div class="flex items-center overflow-hidden rounded border">
							<button
								class="px-2 py-1 transition-colors hover:bg-gray-100"
								on:click={() => updateCartQuantity(index, Math.max(1, item.quantity - 1))}
							>
								-
							</button>
							<span class="min-w-[2.5rem] border-x px-3 py-1 text-center">
								{item.quantity}
							</span>
							<button
								class="px-2 py-1 transition-colors hover:bg-gray-100"
								on:click={() => updateCartQuantity(index, item.quantity + 1)}
							>
								+
							</button>
						</div>
						<button
							class="rounded bg-red-600 px-3 py-1 text-white transition-colors hover:bg-red-700"
							on:click={() => removeFromCart(index)}
						>
							×
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	/* Styling for print */
	@media print {
		.print-title {
			display: none;
		}

		.cart-title::before {
			content: 'Quote';
		}
	}
</style>
