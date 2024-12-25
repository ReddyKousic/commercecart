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
					discountedPrice: price,
					description: data.product[0].description
				}
			];
		}

		// Save to localStorage
		localStorage.setItem('cart', JSON.stringify(cart));
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

			address: data.user.address
		};
	}
	const openModal = () => {
		modal.showModal();
	};

	const closeModal = () => {
		modal.close();
	};
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

	async function handleDownloadQuote(event: { preventDefault: () => void }) {
		event.preventDefault();

		localStorage.setItem('customer_name', customer.name);
		localStorage.setItem('partner_code', customer.partner_code);

		localStorage.setItem('customer_phone', customer.phone);
		localStorage.setItem('customer_email', customer.email);
		localStorage.setItem('customer_address', customer.address);
		localStorage.setItem('gstin', customer.gstin);
		localStorage.setItem('pincode', customer.pincode);

		goto('/quote');
	}
	// onMount(() => {
	// 	openModal();
	// });
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
								on:click={() => decrement(variation.thickness, color)}
							>
								-
							</button>
							<span class="w-8 text-center">
								{variation.thickness && color ? quantities[variation.thickness][color] : 0}
							</span>
							<button
								class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
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
					Partner Code
					<input
						type="tel"
						class="grow"
						name="partner_code"
						placeholder="Optional"
						minlength="10"
						maxlength="10"
						bind:value={customer.partner_code}
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
