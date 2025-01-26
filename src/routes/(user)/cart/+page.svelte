<script lang="ts">
	import Cart from '$lib/components/Cart.svelte';
	import BillIcon from '$lib/assets/BillIcon.svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';
	import { Package } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	const {
		form,
		data
	}: {
		form: ActionData | null;
		data: { user: { id: number; phone: string; name: string; email?: string; gstin?:string; address: string,} };
	} = $props();
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import LoginIcon from '$lib/assets/LoginIcon.svelte';

	import PublicMenu from '$lib/components/PublicMenu.svelte';

	let customer = $state({
		name: '',
		phone: '',
		email: '',
		gstin: '',
		address: ''
	});

	if (data.user) {
		customer = {
			name: data.user.name,
			phone: data.user.phone,
			email: data.user.email || '',
			gstin: data.user.gstin || '',

			address: data.user.address
		};
	}

	async function startDownloadQuote() {
		openModal();
	}

	async function handleDownloadQuote(event: { preventDefault: () => void }) {
		event.preventDefault();

		localStorage.setItem('customer_name', customer.name);
		localStorage.setItem('customer_phone', customer.phone);
		localStorage.setItem('customer_email', customer.email);
		localStorage.setItem('customer_address', customer.address);
		localStorage.setItem('gstin', customer.gstin);


		goto('/quote');
	}

	let modal: HTMLDialogElement;
	let checkoutLoginModal: HTMLDialogElement;

	const openCheckOutModal = () => {
		checkoutLoginModal.showModal();
	};

	const closeCheckOutModal = () => {
		checkoutLoginModal.close();
	};

	const openModal = () => {
		modal.showModal();
	};

	const closeModal = () => {
		modal.close();
	};

	let cart: any[] = $state([]);
	let cartJson: string = $state('');

	onMount(() => {
		const storedCart = localStorage.getItem('cart');
		cart = storedCart ? JSON.parse(storedCart) : [];
		cartJson = JSON.stringify(cart); // Pretty-print JSON for better readability
	});

	$effect(() => {
		if (form?.error) {
			openCheckOutModal();
		}
	});
</script>

<PublicMenu {data} currentPage="cart" />
<Cart />

<div class="flex justify-between gap-2 p-4">
	<button class="btn bg-[#ed1c24] text-white" onclick={startDownloadQuote}> Download Quote </button>

	<button class="btn bg-[#ed1c24] text-white" onclick={openCheckOutModal}> Place order <Package /> </button>
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
				<h3 class="text-lg font-bold">Guest/Login?</h3>
			{/if}
			<p class="py-4">Your Name, Phone, Address, and Email will be included in the Quote PDF.</p>

			<form method="post" onsubmit={handleDownloadQuote}>
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

				<input type="text" class="grow" name="address" bind:value={cart} hidden />

				<div class="flex items-center justify-between">
					<a href="/login">
						<button class="sec btn" type="button">Login?</button>
					</a>

					<button class="btn bg-[#ed1c24] text-white" type="submit">Download Quote</button>
				</div>
			</form>
		{/if}
	</div>
</dialog>

<!-- <button type="button" on:click={closeModal} class="btn">Custom Close</button> -->

<dialog
	id="checkoutLoginModal"
	class="modal modal-bottom sm:modal-middle"
	bind:this={checkoutLoginModal}
>
	<div class="modal-box">
		<!-- if cart.lengyh === 0 just show a message saying cart is empty -->

		{#if cart.length === 0}
			<p class="text-gray-500">
				Your cart is empty. Add items to the cart to order or download the quote.
			</p>
		{:else if data.user}
			<h3 class="text-lg font-bold">Checkout Details</h3>
			<p class="py-2">Please confirm or update your delivery details below.</p>

			<form method="post" action="?/ConfirmOrder">
				<input type="text" name="userId" value={data.user.id} hidden />

				<label class="form-control mb-4 w-full">
					<div class="label">
						<span class="label-text">Name</span>
					</div>
					<input
						type="text"
						name="co_name"
						placeholder="Your full name"
						class="input input-bordered w-full"
						value={data.user.name}
					/>
				</label>

				<label class="form-control mb-4 w-full">
					<div class="label">
						<span class="label-text">Phone (used for delivery)</span>
					</div>
					<input
						name="co_phone"
						placeholder="9999999999"
						minlength="10"
						maxlength="10"
						class="input input-bordered w-full"
						value={data.user.phone}
					/>
				</label>

				<label class="form-control mb-4 w-full">
					<div class="label">
						<span class="label-text">Email (optional)</span>
					</div>
					<input
						type="text"
						name="co_email"
						placeholder="example@wireguy.in"
						class="input input-bordered w-full"
						value={data.user.email || ''}
					/>
				</label>

				<label class="form-control mb-4">
					<div class="label">
						<span class="label-text">Address</span>
					</div>

					<textarea
						name="co_address"
						class="textarea textarea-bordered h-24"
						placeholder="Address of your home"
						value={data.user.address}
					></textarea>
				</label>

				<label class="form-control mb-4">
					<div class="label">
						<span class="label-text">Delivery notes (optional)</span>
					</div>

					<textarea
						name="delivery_notes"
						class="textarea textarea-bordered h-24"
						placeholder="Only mornings."
					></textarea>
				</label>
				<input type="text" class="input grow" name="cart" bind:value={cartJson} hidden />

				<div class="flex items-center justify-end">
					<button class="btn bg-[#ed1c24] text-white" type="submit"
						>Confirm Order (Pay on Delivery)</button
					>
				</div>

				{#if form?.error}
					<div class="alert alert-error mt-4">
						{form.error}
					</div>
				{/if}
			</form>
		{:else}
			<h3 class="mt-4 text-lg font-bold">Login</h3>

			<p class="py-4">
				Please login to map this order to your account.<br /> No account? Create one.
			</p>

			<form method="post" action="?/ManageCheckoutLogin">
				<label class="input input-bordered mb-4 flex items-center gap-2">
					Phone
					<input
						type="tel"
						class="grow"
						name="phone"
						placeholder="9999999999"
						minlength="10"
						maxlength="10"
						value="9090909090"
						required
					/>
				</label>
				<label class="input input-bordered mb-4 flex items-center gap-2">
					Password

					<input
						type="password"
						class="grow"
						name="password"
						placeholder="Your password"
						value="password"
						required
					/>
				</label>

				<input type="text" class="input grow" name="cart" bind:value={cartJson} hidden />

				<div class="flex items-center justify-between">
					<a href="/signup">
						<button class="sec btn" type="button">Create an Account?</button>
					</a>

					<button class="btn bg-[#ed1c24] text-white" type="submit"
						>Login

						<LoginIcon />
					</button>
				</div>

				{#if form?.error}
					<div class="alert alert-error mt-4">
						{form.error}
					</div>
				{/if}
			</form>
		{/if}
	</div>
</dialog>

<style>
	.sec {
		border: 1px solid #ed1c24;
	}
</style>
