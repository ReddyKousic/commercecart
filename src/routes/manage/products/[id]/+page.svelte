<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	// Use reactive statements to update local variables when data changes
	$: product = data.product;
	$: variations = data.variations;

	let editing = false;
	let editingVariationId: number | null = null;

	$: editedProduct = {
		name: product[0].name,
		description: product[0].description,
		selling_status: product[0].selling_status
	};

	let editedPrice: number | null = null;

	async function saveProduct() {
		try {
			const response = await fetch(`/api/products/${product[0].id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editedProduct)
			});

			if (response.ok) {
				// Update the local product data immediately
				product = {
					...product,
					...editedProduct
				};
				editing = false;
				// Still invalidate for complete sync
				await invalidateAll();
			}
		} catch (error) {
			console.error('Failed to save product:', error);
		}
	}

	async function saveVariationPrice(variationId: number) {
		if (editedPrice === null) return;

		try {
			const response = await fetch(`/api/variations/${variationId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ price: editedPrice })
			});

			if (response.ok) {
				// Update the local variations data immediately
				variations = variations.map((v) =>
					v.id === variationId && editedPrice !== null ? { ...v, price: editedPrice } : v
				);
				editingVariationId = null;
				editedPrice = null;
				// Still invalidate for complete sync
				await invalidateAll();
			}
		} catch (error) {
			console.error('Failed to save variation:', error);
		}
	}
</script>

<div class="mx-auto max-w-4xl px-4 py-8">
	<!-- <a href="/products" class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
    </a> -->

	<div class="mb-4 rounded-lg bg-white p-3 shadow-sm">
		{#if !editing}
			<div class="mb-4 flex items-start justify-between">
				<div>
					<h1 class="mb-2 text-3xl font-bold">{product[0].name}</h1>
					{#if product[0].description}
						<p class="mb-4 text-gray-600">{product[0].description}</p>
					{/if}
				</div>
				<button
					type="button"
					on:click={() => (editing = true)}
					class="rounded px-4 py-2 text-sm hover:bg-blue-600"
				>
					Edit
				</button>
			</div>
		{:else}
			<div class="space-y-4">
				<div>
					<label class="input input-bordered flex items-center gap-2">
						Brand
						<input bind:value={editedProduct.name} type="text" class="grow" placeholder="Daisy" />
					</label>
				</div>
				<div>
					<label class="input input-bordered flex items-center gap-2">
						Description
						<input
							bind:value={editedProduct.description}
							type="text"
							class="grow"
							placeholder="Daisy"
						/>
					</label>
				</div>
				<div>
					<select
						id="selling_status"
						name="selling_status"
						bind:value={editedProduct.selling_status}
						class="max-w select select-bordered w-full"
						required
					>
						<option value="" disabled>Select Status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
				<div class="flex gap-2">
					<button on:click={saveProduct} type="button" class="rounded px-4 py-2"> Save </button>
					<button
						on:click={() => (editing = false)}
						class="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
					>
						Cancel
					</button>
				</div>
			</div>
		{/if}

		<div class="mt-4 flex items-center gap-4">
			<span
				class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {product[0]
					.selling_status === 'active'
					? 'bg-green-100 text-green-800'
					: product[0].selling_status === 'inactive'
						? 'bg-red-100 text-red-800'
						: 'bg-gray-100 text-gray-800'}"
			>
				{product[0].selling_status}
			</span>
			<span class="text-sm text-gray-500">
				Added: {new Date(product[0].created_at).toLocaleDateString()}
			</span>
		</div>
	</div>

	<!-- Product variations -->
	<div class="rounded-lg bg-white shadow-sm">
		<h2 class="mb-4 text-xl font-semibold">Product Variations</h2>

		{#if variations.length === 0}
			<p class="text-gray-500">No variations available for this product.</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							{#if variations.some((v) => v.color)}
								<th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
									>Color</th
								>
							{/if}
							{#if variations.some((v) => v.length)}
								<th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
									>Length</th
								>
							{/if}
							{#if variations.some((v) => v.type)}
								<th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th
								>
							{/if}
							<th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Price</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
								>Actions</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each variations as variation}
							<tr>
								{#if variations.some((v) => v.color)}
									<td class="whitespace-nowrap px-6 py-4">{variation.color || '-'}</td>
								{/if}
								{#if variations.some((v) => v.length)}
									<td class="whitespace-nowrap px-6 py-4">{variation.length || '-'}</td>
								{/if}
								{#if variations.some((v) => v.type)}
									<td class="whitespace-nowrap px-6 py-4">{variation.type || '-'}</td>
								{/if}
								<td class="whitespace-nowrap px-6 py-4">
									{#if editingVariationId === variation.id}
										<input
											type="number"
											bind:value={editedPrice}
											class="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										/>
									{:else}
										₹{variation.price.toFixed(2)}
									{/if}
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									{#if editingVariationId === variation.id}
										<div class="flex gap-2">
											<button
												on:click={() => saveVariationPrice(variation.id)}
												class="text-sm text-blue-600 hover:text-blue-800"
											>
												Save
											</button>
											<button
												on:click={() => {
													editingVariationId = null;
													editedPrice = null;
												}}
												class="text-sm text-gray-600 hover:text-gray-800"
											>
												Cancel
											</button>
										</div>
									{:else}
										<button
											on:click={() => {
												editingVariationId = variation.id;
												editedPrice = variation.price;
											}}
											class="text-sm text-blue-600 hover:text-blue-800"
										>
											Edit Price
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<style>
	button[type='button'] {
		border: 1px solid #047857;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
	}

	button[type='button']:hover {
		font-family: 'Poppins', sans-serif;
		font-size: 16px;

		background-color: #047857;
	}
</style>
