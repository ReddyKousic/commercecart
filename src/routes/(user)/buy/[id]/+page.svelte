<script lang="ts">
	import { goto } from '$app/navigation';
	import { vibrate } from '$lib';
	import PublicMenu from '$lib/components/PublicMenu.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { ArrowBigRight } from 'lucide-svelte';
	let { data }: { data: PageData } = $props();
	const colors = ['Red', 'Black', 'Green', 'Blue', 'Yellow'];

	const isolated_colors = ['Standard'];

	interface CartItem {
		variationId: number;
		productId: number;
		thickness: string;
		color: string;
		quantity: number;
		price: number;
		name: string;
		discountedPrice: number;
		description: string;
	}

	let quantities: Record<number, Record<string, number>> = $state({});
	let cart: CartItem[] = $state([]);

	// Load cart first, then initialize quantities
	function initializeQuantities() {
		// First, load the cart from localStorage
		const savedCart = localStorage.getItem('cart');
		if (savedCart) {
			cart = JSON.parse(savedCart);
		}

		// Initialize quantities for all variations
		data.variations.forEach((variation) => {
			quantities[variation.id] = {};

			// Determine the correct color set
			const colorSet = data.product[0].is_isolated ? isolated_colors : colors;

			colorSet.forEach((color) => {
				// Set initial quantity to 0
				quantities[variation.id][color] = 0;

				// If this variation and color exists in cart, update the quantity
				const cartItem = cart.find(
					(item) => item.variationId === variation.id && item.color === color
				);
				if (cartItem) {
					quantities[variation.id][color] = cartItem.quantity;
				}
			});
		});
	}

	onMount(() => {
		initializeQuantities();
	});

	function updateCart(variationId: number, thickness: string, color: string, newQuantity: number) {
		const variation = data.variations.find((v) => v.id === variationId);
		if (!variation) return;

		const price = variation.discount_percentage
			? variation.price - (variation.price * parseFloat(variation.discount_percentage)) / 100
			: variation.price;

		const cartItemIndex = cart.findIndex(
			(item) => item.variationId === variationId && item.color === color
		);

		if (newQuantity === 0 && cartItemIndex !== -1) {
			cart = cart.filter((_, index) => index !== cartItemIndex);
		} else if (cartItemIndex !== -1) {
			cart[cartItemIndex].quantity = newQuantity;
			cart = [...cart];
		} else if (newQuantity > 0) {
			cart = [
				...cart,
				{
					variationId: variation.id,
					productId: data.product[0].id,
					name: data.product[0].name,
					thickness,
					color,
					quantity: newQuantity,
					price: variation.price,
					discountedPrice: price,
					description: data.product[0].description
				}
			];
		}

		localStorage.setItem('cart', JSON.stringify(cart));
	}

	function increment(variationId: number, thickness: string, color: string) {
		if (!quantities[variationId]) {
			quantities[variationId] = {};
		}
		quantities[variationId][color] = (quantities[variationId][color] || 0) + 1;
		updateCart(variationId, thickness, color, quantities[variationId][color]);
		vibrate();
	}

	function decrement(variationId: number, thickness: string, color: string) {
		if (quantities[variationId]?.[color] > 0) {
			quantities[variationId][color]--;
			updateCart(variationId, thickness, color, quantities[variationId][color]);
			vibrate();
		}
	}

	const gotoCart = () => {
		goto('/cart');
	};
</script>

<PublicMenu currentPage={'buy'} {data} />

<div class="heading">
	<h1 class="mt-4 text-center text-2xl font-bold">{data.product[0].name}</h1>
	<p class="mt-2 text-center text-lg">{data.product[0].description}</p>
</div>

<div class="grid grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3">
	<!-- For Isolated Products -->
	{#if data.product[0].is_isolated === true}
		{#each data.variations as variation}
			<div class="mb-2 block rounded-lg border p-4 shadow-sm">
				
				<div class="colors mt-3 flex flex-col space-y-2">
					{#each isolated_colors as color}
						<div class="flex items-center justify-between">
							<!-- <p class="font-medium">{color}</p> -->
							<div class="sub-heading flex justify-between">
								<!-- <h2 class="text-2xl font-medium">{variation.thickness}</h2> -->
								<div class="prices flex flex-col">
									{#if variation.discount_percentage && parseFloat(variation.discount_percentage) > 0}
										<h2 class="text-gray-500 line-through">₹{variation.price}</h2>
										<h2 class="font-bold text-red-600">
											₹{(
												variation.price -
												(variation.price * parseFloat(variation.discount_percentage)) / 100
											).toFixed(2)}
										</h2>
									{:else}
										<h2 class="font-bold text-red-600">₹{variation.price}</h2>
									{/if}
								</div>
							</div>
							<div class="flex items-center space-x-2">
								<button
									class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
									onclick={() => decrement(variation.id, variation.thickness, color)}
								>
									-
								</button>
								<span class="w-8 text-center">
									{quantities[variation.id]?.[color] || 0}
								</span>
								<button
									class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
									onclick={() => increment(variation.id, variation.thickness, color)}
								>
									+
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{:else}
		<!-- For Normal Products -->

		{#each data.variations as variation}
			<div class="mb-2 block rounded-lg border p-4 shadow-sm">
				<div class="sub-heading flex justify-between">
					<h2 class="text-2xl font-medium">{variation.thickness}</h2>
					<div class="prices flex flex-col">
						{#if variation.discount_percentage && parseFloat(variation.discount_percentage) > 0}
							<h2 class="text-gray-500 line-through">₹{variation.price}</h2>
							<h2 class="font-bold text-red-600">
								₹{(
									variation.price -
									(variation.price * parseFloat(variation.discount_percentage)) / 100
								).toFixed(2)}
							</h2>
						{:else}
							<h2 class="font-bold text-red-600">₹{variation.price}</h2>
						{/if}
					</div>
				</div>
				<div class="colors mt-3 flex flex-col space-y-2">
					{#each colors as color}
						<div class="flex items-center justify-between">
							<p class="font-medium">{color}</p>
							<div class="flex items-center space-x-2">
								<button
									class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
									onclick={() => decrement(variation.id, variation.thickness, color)}
								>
									-
								</button>
								<span class="w-8 text-center">
									{quantities[variation.id]?.[color] || 0}
								</span>
								<button
									class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
									onclick={() => increment(variation.id, variation.thickness, color)}
								>
									+
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>

<div class="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg">
	<div class="mx-auto flex max-w-5xl items-center justify-between gap-2">
		<div class="text-lg font-bold">
			₹{cart.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0).toFixed(2)}
		</div>
		<button
			class="btnMx btn flex items-center space-x-2 rounded-lg px-6 py-3 font-medium text-white"
			onclick={gotoCart}
		>
			<span>Proceed</span>
		</button>
	</div>
</div>

<div class="mx-auto mb-6 max-w-2xl rounded-lg bg-white p-4 pb-60">
	<h2 class="mb-4 text-xl font-bold">Cart Summary</h2>
	{#if cart.length === 0}
		<p class="text-gray-500">Your cart is empty</p>
	{:else}
		<div class="space-y-2">
			{#each cart as item}
				<div class="flex items-center justify-between border-b py-2">
					<div>
						<p class="font-medium">{item.name}</p>
						<p class="text-sm text-gray-600">
							{item.thickness} - {item.color}
						</p>
					</div>
					<div class="text-right">
						<p class="text-gray-500 line-through">₹{(item.price * item.quantity).toFixed(2)}</p>
						<p class="font-bold text-red-600">
							₹{(item.discountedPrice * item.quantity).toFixed(2)}
						</p>

						<p class="text-sm text-gray-600">Qty: {item.quantity}</p>
					</div>
				</div>
			{/each}
			<div class="pt-4 text-right font-bold">
				Total: ₹{cart
					.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0)
					.toFixed(2)}
			</div>
		</div>
	{/if}
</div>

<style>
	.btnMx {
		background-color: #ed1c24;
		color: white;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
		border-radius: 20px;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
