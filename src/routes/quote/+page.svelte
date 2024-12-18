<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/MainLogo.png';
	let { data }: { data: PageData } = $props();

	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let address = $state('');
	let gstin = $state('');


	// cart is of type [{ name: string, color: string, length: number, type: string, price: number, discountedPrice: number, quantity: number }]
	

	
	// let cart = $state<{ name: string, color: string, length: number, type: string, price: number, discountedPrice: number, quantity: number }[]>([]);
	let cart = $state<{ name: string, color: string, price: number, thickness: string, discountedPrice: number, quantity: number }[]>([]);

	let isDataLoaded = $state(false);

	onMount(() => {
		// Get customer details from localStorage
		const storedName = localStorage.getItem('customer_name');
		const storedPhone = localStorage.getItem('customer_phone');
		const storedAddress = localStorage.getItem('customer_address');
		const storedCart = localStorage.getItem('cart');
		const storedGSTIN = localStorage.getItem('gstin');


		// Check if required data exists
		if (!storedName || !storedPhone || !storedAddress || !storedCart) {
			goto('/cart');
			return;
		}

		// Set the values
		name = storedName;
		phone = storedPhone;
		gstin = storedGSTIN || '';
		address = storedAddress;
		cart = JSON.parse(storedCart);

		// Mark data as loaded
		isDataLoaded = true;

		// Wait for the next tick to ensure DOM is updated
		setTimeout(() => {
			window.print(); 
		}, 1000);
	});

	// Calculate the quote validity date
	const quoteDate = new Date();
	const validUntil = new Date(quoteDate.getTime() + 15 * 24 * 60 * 60 * 1000);

	// Calculate totals using runes
	let subtotal = $state(0);
	let total = $state(0);

	// Update calculations when cart changes
	$effect(() => {
		subtotal = cart.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
		total = subtotal;
	});
</script>

<svelte:head>
	<title>Quotation</title>
</svelte:head>

<!-- Show loading state until data is ready -->
{#if !isDataLoaded}
	<div class="flex min-h-screen items-center justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else}
	<div class="min-h-screen bg-base-200 p-4">
		<div class="mx-auto max-w-4xl rounded-lg bg-base-100 shadow-xl">
			<!-- Header with Logo -->
			<div class="rounded-t-lg p-6">
				<div class="mb-4 flex items-center justify-between">
					<img src={logo} alt="WireGuy Logo" class="h-20 w-auto" />
					<div>
						<h1 class="text-3xl font-bold">Quotation</h1>
						<p class="text-sm opacity-90">Valid for 15 days</p>
					</div>
				</div>
			</div>

			<!-- Customer Info -->
			<div class="border-b p-6">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="font-medium">{name}</p>
						<p>{address}</p>
						<p>Phone: {phone}</p>
						{#if email !== ""}
							<p>Email: {email}</p>
						{/if} 
						{#if gstin !== "No GSTIN provided"}
							<p>GSTIN: {gstin}</p>
						{/if}
			
				

					</div>
					<div class="text-right">
						<p class="text-sm">Quote Date: {quoteDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
						<p class="text-sm">Valid Until: {validUntil.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
						
					</div>
				</div>
			</div>

			<!-- Items Table -->
			<div class="overflow-x-auto p-6">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th>Product</th>
							<th>Specifications</th>
							<th>Quantity</th>
							<th>Price</th>
							<th>Discounted Price</th>
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{#each cart as item}
							<tr>
								<td>{item.name}</td>
								<td>
									<span class="badge badge-ghost mr-1">{item.color}</span>
									<span class="badge badge-ghost mr-1">{item.thickness}</span>

									<!-- <span class="badge badge-ghost mr-1">{item.length}m</span>
									<span class="badge badge-ghost">{item.type}</span> -->
								</td>
								<td>{item.quantity}</td>
								<td>
									<span class="line-through text-sm text-gray-400">₹{item.price.toLocaleString()}</span>
								</td>
								<td>₹{item.discountedPrice.toLocaleString()}</td>
								<td>₹{(item.discountedPrice * item.quantity).toLocaleString()}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Summary -->
			<div class="bg-base-200 p-6">
				<div class="flex justify-end">
					<div class="w-64">
						<div class="mb-2 flex justify-between">
							<span>Subtotal:</span>
							<span>₹{subtotal.toLocaleString()}</span>
						</div>
						<div class="mb-2 flex justify-between">
							<span>Taxes:</span>
							<span>All inclusive</span>
						</div>
						<div class="flex justify-between text-lg font-bold">
							<span>Total:</span>
							<span>₹{total.toLocaleString()}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Terms -->
			<div class="p-6 text-sm text-base-content/70">
				<p class="mb-2">Terms and Conditions:</p>
				<ul class="list-disc space-y-1 pl-5">
					<li>This quotation is valid for 15 days from the date of issue</li>
					<li>Prices are inclusive of GST</li>
					<li>Delivery timeline will be confirmed upon order confirmation</li>
					<li>Payment terms: 100% advance</li>
				</ul>
			</div>

			<!-- Footer with Company Details -->
			<div class="rounded-b-lg bg-base-300 p-6 text-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="font-semibold">Koastec - High Performance Systems</p>
						<p>Your Trusted Partner in Industrial Solutions</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Print-specific styles */
	@media print {
		.bg-base-200 {
			background-color: white !important;
		}

		.shadow-xl {
			box-shadow: none !important;
		}

		.loading {
			display: none !important;
		}

		@page {
			margin: 0.5cm;
		}
	}
</style>
