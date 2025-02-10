<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { Trash2 } from 'lucide-svelte';
	export let data: PageData;
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
	let editedDiscount: number | null = null;

	async function saveProduct() {
		try {
			const response = await fetch(`/api/products/${product[0].id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editedProduct)
			});

			if (response.ok) {
				product = { ...product, ...editedProduct };
				editing = false;
				await invalidateAll();
			}
		} catch (error) {
			console.error('Failed to save product:', error);
		}
	}

	async function saveVariation(variationId: number) {
		if (editedPrice === null || editedDiscount === null) return;

		try {
			const response = await fetch(`/api/variations/${variationId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ price: editedPrice, discount_percentage: editedDiscount })
			});

			if (response.ok) {
				variations = variations.map((v) =>
					v.id === variationId
						? { ...v, price: editedPrice, discount_percentage: editedDiscount }
						: v
				);
				editingVariationId = null;
				editedPrice = null;
				editedDiscount = null;
				await invalidateAll();
			}
		} catch (error) {
			console.error('Failed to save variation:', error);
		}
	}

	async function deleteProduct(productId: number): Promise<void> {
		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json(); // Try to get error details
				throw new Error(errorData.error || `HTTP error! status: ${response.status}`); // Throw with error message
			}

			const data = await response.json(); // Get the JSON response

			if (data.success) {
				await invalidateAll(); // Invalidate cached data
				console.log(data.message); // Log the success message
				// Optionally, you can redirect or update UI here
				goto('/manage/products');
			} else {
				console.error(data.error || 'Product deletion failed.'); // Handle specific errors
			}
		} catch (error) {
			console.error('Error deleting product:', error); // Handle network or other errors
			// Optionally, display an error message to the user
			alert('Error deleting product. Please try again later.'); // Example alert
		}
	}

	async function handleDelete(product: Product) {
		// Pass the product object
		if (confirm(`Are you sure you want to delete ${product.name}?`)) {
			// Confirm before deleting
			await deleteProduct(product.id);
		}
	}
</script>

<div class="mx-auto max-w-4xl px-4 py-8">
	<div class="mb-4 rounded-lg border bg-white p-3">
		{#if !editing}
			<div class="mb-4 flex items-start justify-between">
				<div>
					<h1 class="mb-2 text-3xl font-bold">{product[0].name}</h1>
					<p class="mb-4 text-gray-600">{product[0].description}</p>
				</div>

				<button
					type="button"
					on:click={() => (editing = true)}
					class="rounded px-4 py-2 text-sm hover:bg-blue-600">Edit</button
				>
			</div>
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
		{:else}
			<div class="space-y-4">
				<label class="input input-bordered flex items-center gap-2">
					Brand
					<input bind:value={editedProduct.name} type="text" class="grow" placeholder="Daisy" />
				</label>
				<label class="input input-bordered flex items-center gap-2">
					Description
					<input
						bind:value={editedProduct.description}
						type="text"
						class="grow"
						placeholder="Description"
					/>
				</label>
				<select
					bind:value={editedProduct.selling_status}
					class="max-w select select-bordered w-full"
					required
				>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
				</select>
				<div class="flex items-center justify-between gap-2">
					<div>
						<button on:click={saveProduct} class="rounded px-4 py-2">Save</button>
						<button
							on:click={() => (editing = false)}
							class="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">Cancel</button
						>
					</div>

					<button class="btn border-red-700" on:click={handleDelete(product[0])}
						><Trash2 color="#D32F2F" /></button
					>
				</div>
			</div>
		{/if}
	</div>

	<div class="rounded-lg bg-white shadow-sm">
		<h2 class="mb-4 text-xl font-semibold">Product Variations</h2>
		{#if variations.length === 0}
			<p class="text-gray-500">No variations available for this product.</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="table divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<!-- <th>Color</th> -->
							<!-- <th>Length</th>
							<th>Type</th> -->
							<th>Thickness</th>
							<th>Price</th>
							<th>Discount %</th>
							<th>Selling Price</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each variations as variation}
							<tr>
								<!-- <td>{variation.color || '-'}</td> -->
								<!-- <td>{variation.length || '-'}</td>
								<td>{variation.type || '-'}</td> -->
								<td>{variation.thickness || '-'}</td>
								<td>
									{#if editingVariationId === variation.id}
										<input bind:value={editedPrice} type="number" class="w-20 rounded-md" />
									{:else}
										₹{variation.price.toFixed(2)}
									{/if}
								</td>
								<td>
									{#if editingVariationId === variation.id}
										<input bind:value={editedDiscount} type="number" class="w-20 rounded-md" />
									{:else}
										{variation.discount_percentage}%
									{/if}
								</td>
								<td>
									₹
									{(
										variation.price -
										(variation.price * variation.discount_percentage) / 100
									).toFixed(2)}
								</td>
								<td>
									{#if editingVariationId === variation.id}
										<div class="flex gap-2">
											<button
												on:click={() => saveVariation(variation.id)}
												class="text-sm text-blue-600">Save</button
											>
											<button
												on:click={() => (editingVariationId = null)}
												class="text-sm text-gray-600">Cancel</button
											>
										</div>
									{:else}
										<button
											on:click={() => {
												editingVariationId = variation.id;
												editedPrice = variation.price;
												editedDiscount = variation.discount_percentage;
											}}
											class="text-sm text-blue-600"
										>
											Edit
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
		background-color: #047857;
	}
</style>
