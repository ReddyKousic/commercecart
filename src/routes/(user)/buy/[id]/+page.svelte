<script lang="ts">
	import { vibrate } from '$lib';
	import PublicMenu from '$lib/components/PublicMenu.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	const colors = ['Red', 'Black', 'Green', 'Blue', 'Yellow'];

	interface CartItem {
		variationId: number;

		productId: number;
		thickness: string;
		color: string;
		quantity: number;
		price: number;
		name: string;
		discountedPrice: number;
	}

	let quantities: Record<string, Record<string, number>> = $state({});
	let cart: CartItem[] = $state([]);

	// Initialize quantities
	data.variations.forEach((variation) => {
		quantities[variation.thickness] = {};
		colors.forEach((color) => {
			quantities[variation.thickness][color] = 0;
		});
	});

	onMount(() => {
		// Load cart from localStorage on component mount
		const savedCart = localStorage.getItem('cart');
		if (savedCart) {
			cart = JSON.parse(savedCart);
			// Update quantities based on cart
			cart.forEach((item) => {
				quantities[item.thickness][item.color] = item.quantity;
			});
		}
	});

	function updateCart(thickness: string, color: string, newQuantity: number) {
		const variation = data.variations.find((v) => v.thickness === thickness);
		if (!variation) return;

		const price = variation.discount_percentage
			? variation.price - (variation.price * parseFloat(variation.discount_percentage)) / 100
			: variation.price;

		const cartItemIndex = cart.findIndex(
			(item) =>
				item.productId === data.product[0].id &&
				item.thickness === thickness &&
				item.color === color
		);

		if (newQuantity === 0 && cartItemIndex !== -1) {
			// Remove item from cart
			cart = cart.filter((_, index) => index !== cartItemIndex);
		} else if (cartItemIndex !== -1) {
			// Update existing item
			cart[cartItemIndex].quantity = newQuantity;
			cart = [...cart]; // Trigger reactivity
		} else if (newQuantity > 0) {
			// Add new item
			cart = [
				...cart,
				{
					variationId: variation ? variation.id : 0,
					productId: data.product[0].id,
					name: data.product[0].name,
					thickness,
					color,
					quantity: newQuantity,
					price: variation.price,
					discountedPrice: price
				}
			];
		}

		// Save to localStorage
		localStorage.setItem('cart', JSON.stringify(cart));
	}

	function increment(thickness: string, color: string) {
		quantities[thickness][color]++;
		updateCart(thickness, color, quantities[thickness][color]);
		vibrate();

	}

	function decrement(thickness: string, color: string) {
		if (quantities[thickness][color] > 0) {
			quantities[thickness][color]--;
			updateCart(thickness, color, quantities[thickness][color]);
		vibrate();

		}
	}
</script>

<PublicMenu currentPage={'buy'} {data} />

<div class="heading">
	<h1 class="mt-4 text-center text-2xl font-bold">{data.product[0].name}</h1>
	<p class="mt-2 text-center text-lg">{data.product[0].description}</p>
</div>

<div class="grid grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3">
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
								class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
								on:click={() => decrement(variation.thickness, color)}
							>
								-
							</button>
							<span class="w-8 text-center">
								{variation.thickness && color ? quantities[variation.thickness][color] : 0}
							</span>
							<button
								class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
								on:click={() => increment(variation.thickness, color)}
							>
								+
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
<div class="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg">
	<div class="mx-auto flex max-w-5xl items-center justify-between gap-2">
		<div class="text-lg font-bold">
			₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
		</div>
		<a
			href="/cart"
			class="flex items-center space-x-2 rounded-lg btnMx px-6 py-3 font-medium text-white"
		>
			<span>Proceed</span>
		</a>
	</div>
</div>
<!-- Cart Summary -->
<div class="mx-auto mb-6 max-w-2xl rounded-lg bg-white p-4 pb-52 shadow">
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
						<p class="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
						<p class="text-sm text-gray-600">Qty: {item.quantity}</p>
					</div>
				</div>
			{/each}
			<div class="pt-4 text-right font-bold">
				Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
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