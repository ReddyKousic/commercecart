<script>
// @ts-nocheck

	import { onMount } from 'svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';
	import PublicMenu from '$lib/components/PublicMenu.svelte';
	import Cart from '$lib/components/Cart.svelte';

	export let data;

	let product = data.product[0];
	let variations = data.variations;
	let selectedColor = '';
	let selectedLength = '';
	let selectedType = '';
	let selectedThickness = '';
	let selectedPrice = null;
	let discountedPrice = null;
	let discountPercentage = null;
	let quantity = 1;

	let cart = [];

	onMount(() => {
		const storedCart = localStorage.getItem('cart');
		cart = storedCart ? JSON.parse(storedCart) : [];
	});

	function handleSelection() {
		const variation = variations.find(
			(v) =>
				v.color === selectedColor &&
				v.length === Number(selectedLength) &&
				v.type === selectedType &&
				v.thickness === selectedThickness
		);

		if (variation) {
			selectedPrice = variation.price;
			discountPercentage = variation.discount_percentage || 0;
			discountedPrice = selectedPrice - (selectedPrice * discountPercentage) / 100;
		} else {
			selectedPrice = null;
			discountedPrice = null;
		}
	}

	function addToCart() {
		if (!discountedPrice || !quantity) return;

		const existingItem = cart.find(
			(item) =>
				item.productId === product.id &&
				item.color === selectedColor &&
				item.length === selectedLength &&
				item.type === selectedType &&
				item.thickness === selectedThickness
		);

		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			cart = [
				...cart,
				{
					productId: product.id,
					name: product.name,
					color: selectedColor,
					length: selectedLength,
					type: selectedType,
					thickness: selectedThickness,
					price: selectedPrice,
					variationId: variations.find(
						(v) =>
							v.color === selectedColor &&
							v.length === Number(selectedLength) &&
							v.type === selectedType &&
							v.thickness === selectedThickness
					).id,
					discountedPrice,
					quantity
				}
			];
		}

		localStorage.setItem('cart', JSON.stringify(cart));
		window.location.reload();
		alert('Added to cart!');
	}
</script>
	
<PublicMenu {data} currentPage={"buy"}/>

<div class="mx-auto max-w-7xl px-4 py-8">
	<h1 class="text-center text-2xl font-bold">{product.name}</h1>
	{#if product.description}
		<p class="mt-2 text-center text-gray-600">{product.description}</p>
	{/if}

	<div class="mt-6 space-y-4">
		<!-- Color Selection -->
		<div>
			<div class="mt-2 flex flex-wrap justify-center gap-2">
				{#each Array.from(new Set(variations.map((v) => v.color))) as color}
					<button
						class="btn rounded border px-4 py-2 {selectedColor === color
							? 'bg-[#ed1c24] text-white'
							: ''}"
						on:click={() => {
							selectedColor = color;
							handleSelection();
						}}
					>
						{color}
					</button>
				{/each}
			</div>
		</div>

		<!-- Length Selection -->
		<div>
			<div class="mt-2 flex flex-wrap justify-center gap-2">
				{#each Array.from(new Set(variations.map((v) => v.length))) as length}
					<button
						class="btn rounded border px-4 py-2 {selectedLength == length
							? 'bg-[#ed1c24] text-white'
							: ''}"
						on:click={() => {
							selectedLength = length;
							handleSelection();
						}}
					>
						{length} meters
					</button>
				{/each}
			</div>
		</div>

		<!-- Type Selection -->
		<div>
			<div class="mt-2 flex flex-wrap justify-center gap-2">
				{#each Array.from(new Set(variations.map((v) => v.type))) as type}
					<button
						class="btn rounded border px-4 py-2 {selectedType === type
							? 'bg-[#ed1c24] text-white'
							: ''}"
						on:click={() => {
							selectedType = type;
							handleSelection();
						}}
					>
						{type}
					</button>
				{/each}
			</div>
		</div>

		<!-- Thickness Selection -->
		<div>
			<div class="mt-2 flex flex-wrap justify-center gap-2">
				{#each Array.from(new Set(variations.map((v) => v.thickness))) as thickness}
					<button
						class="btn rounded border px-4 py-2 {selectedThickness === thickness
							? 'bg-[#ed1c24] text-white'
							: ''}"
						on:click={() => {
							selectedThickness = thickness;
							handleSelection();
						}}
					>
						{thickness}
					</button>
				{/each}
			</div>
		</div>

		<!-- Price Display -->
		{#if discountedPrice !== null}
			<div>
				<p class="text-center text-lg">
					<span class="text-gray-500 line-through">₹{selectedPrice}</span>
					<span class="text-2xl font-semibold text-red-600">₹{discountedPrice.toFixed(2)}</span>
				</p>
			</div>

			<!-- Quantity Selection -->
			<div class="mt-2 flex items-center justify-center gap-2">
				<div class="flex items-center overflow-hidden rounded border">
					<button class="px-3 py-1" on:click={() => (quantity = Math.max(1, quantity - 1))}
						>-</button
					>
					<span class="min-w-[3rem] border-x px-4 py-1 text-center">{quantity}</span>
					<button class="px-3 py-1" on:click={() => (quantity = quantity + 1)}>+</button>
				</div>
			</div>
			<button
				class="m-auto mt-4 block rounded bg-[#ed1c24] px-4 py-2 text-white"
				on:click={addToCart}
			>
				Add to Cart
			</button>
		{:else}
			<p class="text-center text-gray-500">Select all options to see the price & add to cart.</p>
		{/if}
	</div>
<Cart />

</div>

