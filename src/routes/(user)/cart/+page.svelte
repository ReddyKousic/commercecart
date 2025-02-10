<script lang="ts">
	import Cart from '$lib/components/Cart.svelte';
	import { enhance } from '$app/forms';
	import BillIcon from '$lib/assets/BillIcon.svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';
	import { Package } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	// @ts-nocheck
	const {
		form,
		data
	}: {
		form: ActionData | null;
		data: {
			user: {
				id: number;
				phone: string;
				name: string;
				email?: string;
				gstin?: string;
				address: string;
			};
		};
	} = $props();
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import LoginIcon from '$lib/assets/LoginIcon.svelte';

	import PublicMenu from '$lib/components/PublicMenu.svelte';
	import { PUBLIC_RAZORPAY_ID } from '$env/static/public';
	// import Razorpay from 'razorpay';
	import { page } from '$app/stores';

	let hostname = $state('');
	$effect(() => {
		hostname = $page.url.origin;
		console.log(hostname);
	});
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
			if(form.origin === 'DownloadQuote'){
				openModal();
			}
			// openCheckOutModal();
		}
	});

	let rzp_order_id = $state('');
	let rzp_order_amount = $state(0);
	function toTwoDecimals(num) {
		return Number(Number(num).toFixed(2));
	}
	async function payNow(lc_orderId: number) {
		// Open Razorpay Checkout
		const options = {
			key: { PUBLIC_RAZORPAY_ID }, // Replace with your Razorpay key_id
			amount: toTwoDecimals(rzp_order_amount), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
			currency: 'INR',
			image: `${hostname}/src/lib/assets/MainLogo.webp`,
			name: 'Wireguy Electricals Private Limited',
			description: 'Order Payment',
			order_id: rzp_order_id, // This is the order_id created in the backend
			callback_url: `${hostname}/account/orders`, // Your success URL
			prefill: {
				name: customer.name,
				email: customer.email,
				contact: customer.phone
			},
			handler: function (response) {
				// Send these details using PATCH to /api/verifyPayment

				fetch('/api/verifyPayment', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						razorpay_payment_id: response.razorpay_payment_id,
						razorpay_order_id: response.razorpay_order_id,
						razorpay_signature: response.razorpay_signature,
						lc_orderId
					})
				})
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
						if (data.success === true) {
							// alert('Payment successful');
							localStorage.removeItem('cart');
							goto('/account/orders');
						} else {
							alert('Payment failed');
						}
					})
					.catch((err) => {
						console.error(err);
						alert('Payment failed');
					});
			}
		};

		const rzp = new Razorpay(options);
		rzp.open();
	}
	let checkOutError = $state('');
	async function handleConfirmOrder() {
		console.log('Confirming order EOL2001');
		isLoading = true;

		return async ({
			result
		}: {
			result: {
				type: string;
				data: {
					lc_orderId: number;
					rzp_order_amount: number;
					rzp_order_id: string;
				};
			};
		}) => {
			console.log(result);
			if (result.type === 'success') {
				// Access the order_id from the returned data for the ConfirmOrder action
				rzp_order_id = result.data.rzp_order_id;
				rzp_order_amount = result.data.rzp_order_amount;
				console.log(rzp_order_id, rzp_order_amount);
				console.log(typeof rzp_order_id, typeof rzp_order_amount);

				closeCheckOutModal();
				isLoading = false;

				await payNow(result.data.lc_orderId);
			} else {
				isLoading = false;

				checkOutError = result.data.error;
			}
		};
	}

	// onMount(() => {
	// 	openCheckOutModal();
	// });

	let isLoading = $state(false);
</script>

<PublicMenu {data} currentPage="cart" />
<Cart />

<div class="flex justify-between gap-2 p-4">
	<button class="btn bg-[#ed1c24] text-white" onclick={startDownloadQuote}> Download Quote </button>

	<button class="btn bg-[#ed1c24] text-white" onclick={openCheckOutModal}>
		Place order <Package />
	</button>
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

			<!-- <form method="post" onsubmit={handleDownloadQuote}> -->
			<form method="post" action="?/DownloadQuote">

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
						name="gstin"
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
					Partner Code
					<input
						type="tel"
						class="grow"
						name="partner_code"
						placeholder="K029  (Optional)"
						minlength="3"
						maxlength="15"
			
						
					/>
				</label>

				<input type="text" class="grow" name="address" bind:value={cart} hidden />
	
				{#if form?.error}
					<div class="alert alert-error mt-4 mb-4">
						{form.error}
					</div>
				{/if}
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

			<form method="post" use:enhance={handleConfirmOrder} action="?/ConfirmOrder">
				<!-- 
			<form
				method="post"
				use:enhance={() => {
					isLoading = true;
					return async ({ result, update }) => {
						isLoading = false;
						handleConfirmOrder();
					};
				}}
				action="?/ConfirmOrder"
			> -->
				<input type="text" name="userId" value={data.user.id} hidden />

				<label class="form-control mb-4 w-full">
					<div class="label">
						<span class="label-text">Billing Name</span>
					</div>
					<input
						type="text"
						name="co_name"
						placeholder="Your full name"
						class="input input-bordered w-full"
						value={data.user.name}
						required
					/>
				</label>
				<label class="form-control mb-4">
					<div class="label">
						<span class="label-text">Billing Address</span>
					</div>

					<textarea
						name="co_address"
						class="textarea textarea-bordered h-24"
						placeholder="Address linked to your payment method"
						value={data.user.address}
						required
					></textarea>
				</label>
				<label class="form-control mb-4 w-full">
					<div class="label">
						<span class="label-text">Billing Phone</span>
					</div>
					<input
						name="co_phone"
						placeholder="9999999999"
						minlength="10"
						maxlength="10"
						class="input input-bordered w-full"
						value={data.user.phone}
						required
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

				<label class="form-control mb-4 w-full">
					<div class="label">
						<span class="label-text">GST Number (Optional)</span>
					</div>
					<input
						type="text"
						name="co_gstin"
						placeholder="Eg. 22AAAAA0000A1Z5"
						class="input input-bordered w-full"
						maxlength="15"
						minlength="15"
					/>
				</label>

				<label class="form-control mb-4">
					<div class="label">
						<span class="label-text">Delivery Address</span>
					</div>

					<textarea
						name="delivery_address"
						class="textarea textarea-bordered h-24"
						placeholder="Address where you want your order to be delivered"
						required
					></textarea>
				</label>

				<label class="form-control mb-4 w-full">
					<div class="label">
						<span class="label-text">Pincode</span>
					</div>
					<input
						name="pincode"
						placeholder="Eg. 522237"
						minlength="6"
						maxlength="6"
						class="input input-bordered w-full"
						required
					/>
				</label>

				<label class="form-control mb-4 w-full">
					<div class="label">
						<span class="label-text">Delivery Phone</span>
					</div>
					<input
						name="delivery_phone"
						placeholder="9999999999"
						minlength="10"
						maxlength="10"
						class="input input-bordered w-full"
						required
					/>
				</label>

				<label class="form-control mb-4">
					<div class="label">
						<span class="label-text">Delivery Notes</span>
					</div>

					<textarea
						name="delivery_notes"
						class="textarea textarea-bordered h-24"
						placeholder="Notes for the delivery executive"
					></textarea>
				</label>

				<label class="form-control mb-4 w-full">
					<div class="label">
						<span class="label-text">Partner Code (Optional)</span>
					</div>
					<input
						name="partner_code"
						placeholder="Eg. K090"
						minlength="3"
						maxlength="15"
						class="input input-bordered w-full"
					/>
				</label>

				<input type="text" class="input grow" name="cart" bind:value={cartJson} hidden />

				{#if checkOutError}
					<div class="alert alert-error mt-4">
						{checkOutError}
					</div>
				{/if}
				<div class="flex items-center justify-end">
					<button class="btn bg-[#ed1c24] text-white" type="submit" disabled={isLoading}>
						{#if isLoading}
							<span class="loading loading-dots loading-xs"></span>
						{:else}
							Confrim Order and Pay
						{/if}
					</button>
				</div>
<!-- 				
				{#if form?.error}
					<div class="alert alert-error mt-4">
						{form.error}
					</div>
				{/if} -->
			</form>
		{:else}
			<h3 class="mt-4 text-lg font-bold">Login</h3>

			<p class="py-4">
				Please login to map this order to your account. A Login will automatically creatre an account.
			</p>

			<!-- <form method="post" action="?/ManageCheckoutLogin">
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
			</form> -->
			<div class="flex items-center justify-between">
				<div></div>

				<a class="btn bg-[#ed1c24] text-white" href="/login?redirect=/cart">
					Login

					<LoginIcon />
				</a>
			</div>
		{/if}
	</div>
</dialog>

<style>
	.sec {
		border: 1px solid #ed1c24;
	}
</style>
