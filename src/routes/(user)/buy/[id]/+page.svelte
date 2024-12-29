<script lang="ts">
	import { goto } from '$app/navigation';
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
			colors.forEach((color) => {
				// Set initial quantity to 0
				quantities[variation.id][color] = 0;
				
				// If this variation and color exists in cart, update the quantity
				const cartItem = cart.find(
					item => item.variationId === variation.id && item.color === color
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

	let modal: HTMLDialogElement;

	let customer = $state({
		name: '',
		phone: '',
		email: '',
		gstin: '',
		address: '',
		pincode: '',
		partner_code: ''
	});
	if (data.user) {
		customer = {
			name: data.user.name,
			phone: data.user.phone,
			email: data.user.email || '',
			gstin: '',
			address: data.user.address,
			pincode: '',
			partner_code: ''
		};
	}
	const openModal = () => {
		modal.showModal();
	};

	const closeModal = () => {
		modal.close();
	};

	async function handleDownloadQuote(event: { preventDefault: () => void }) {
		event.preventDefault();

		localStorage.setItem('customer_name', customer.name);
		localStorage.setItem('partner_code', customer.partner_code);

		localStorage.setItem('customer_phone', customer.phone);
		localStorage.setItem('customer_email', customer.email);
		localStorage.setItem('customer_address', customer.address);
		localStorage.setItem('gstin', customer.gstin);
		localStorage.setItem('pincode', customer.pincode);

		if (customer.partner_code !== '') {
			try {
				const response = await fetch(`/api/partners/${customer.partner_code}`);

				if (response.status === 200) {
					const partner = await response.json();
					if (partner) {
						localStorage.setItem(
							'partner_overall_discount_percentage',
							parseFloat(partner.overall_discount)
						);
					}
				} else if (response.status === 404) {
					alert('Partner not found. Please check the partner code.');
					return;
				} else {
					alert('An error occurred while fetching partner details. Please try again later.');
					return;
				}
			} catch (error) {
				alert('An error occurred while fetching partner details. Please try again later.');
				return;
			}
		}

		goto('/quote');
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
								class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
								on:click={() => decrement(variation.id, variation.thickness, color)}
							>
								-
							</button>
							<span class="w-8 text-center">
								{quantities[variation.id]?.[color] || 0}
							</span>
							<button
								class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
								on:click={() => increment(variation.id, variation.thickness, color)}
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
			₹{cart.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0).toFixed(2)}
		</div>
		<button
			class="btnMx btn flex items-center space-x-2 rounded-lg px-6 py-3 font-medium text-white"
			on:click={openModal}
		>
			<span>Proceed</span>
		</button>
	</div>
</div>

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

<dialog id="DownloadQuoteModal" class="modal modal-bottom sm:modal-middle" bind:this={modal}>
	<div class="modal-box">
		{#if cart.length === 0}
			<p class="text-gray-500">
				Your cart is empty. Add items to the cart to order or download the quote.
			</p>
		{:else}
			{#if data.user}
				<h3 class="text-lg font-bold">Confirm the data</h3>
			{:else}
				<h3 class="text-lg font-bold">Download or CheckOut</h3>
			{/if}
			<p class="py-4">The following details will be included in the Quote PDF</p>

			<form method="post" on:submit={handleDownloadQuote}>
				<label class="input input-bordered mb-4 flex items-center gap-2">
					Name
					<input
						type="text"
						class="grow"
						name="name"
						placeholder="MD Waasim"
						bind:value={customer.name}
						required
					/>
				</label>

				<label class="input input-bordered mb-4 flex items-center gap-2">
					Phone
					<input
						type="tel"
						class="grow"
						name="phone"
						placeholder="9999999999"
						minlength="10"
						maxlength="10"
						bind:value={customer.phone}
						required
					/>
				</label>

				<label class="input input-bordered mb-4 flex items-center gap-2">
					Email
					<input
						type="email"
						class="grow"
						name="email"
						placeholder="Optional"
						bind:value={customer.email}
					/>
				</label>

				<label class="input input-bordered mb-4 flex items-center gap-2">
					GSTIN
					<input
						type="text"
						class="grow"
						name="email"
						placeholder="Optional"
						bind:value={customer.gstin}
					/>
				</label>

				<label class="input input-bordered mb-4 flex items-center gap-2">
					Address
					<input
						type="text"
						class="grow"
						name="address"
						placeholder="101, Royal Enclave, New RTC colony, Patamata, Vijayawada 520007"
						aria-label="address"
						bind:value={customer.address}
						required
					/>
				</label>

				<label class="input input-bordered mb-4 flex items-center gap-2">
					Pincode
					<input
						type="text"
						class="grow"
						name="pincode"
						placeholder="520007"
						aria-label="pincode"
						bind:value={customer.pincode}
						required
					/>
				</label>

				<label class="input input-bordered mb-4 flex items-center gap-2">
					Partner Code
					<input
						type="text"
						class="grow"
						name="partner_code"
						placeholder="Optional"
						minlength="3"
						bind:value={customer.partner_code}
					/>
				</label>

				<input type="text" class="grow" name="address" bind:value={cart} hidden />

				<div class="flex items-center justify-between">
					<a href="/cart">
						<button class="sec btn" type="button">Checkout</button>
					</a>

					<button class="btn bg-[#ed1c24] text-white" type="submit">Download Quote</button>
				</div>
			</form>
		{/if}
	</div>
</dialog>

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