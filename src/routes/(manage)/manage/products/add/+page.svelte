<script lang="ts">
	import type { ActionData } from './$types';
	import { onMount } from 'svelte';
	export let form: ActionData | null; // Form data returned by the server

	const colors = ['Red', 'Black', 'Green', 'Blue', 'Yellow'];
	const lengths = ['90', '180'];
	const types = ['FR', 'FRLS'];
	const thicknesses = ['0.5mm', '1mm', '1.5mm', '2.5mm', '4mm'];

	let variations: {
		color: string;
		length: string;
		type: string;
		thickness: string;
		price: string;
		discount_percentage: string;
		error?: string; // To store validation errors
	}[] = [];

	let name = '';
	let description = '';
	let selling_status = 'active';

	function validateUniqueCombinations() {
		const seen = new Set();
		variations.forEach((v, i) => {
			const key = `${v.color}-${v.length}-${v.type}-${v.thickness}`;
			if (seen.has(key)) {
				variations[i].error = 'Duplicate combination';
			} else {
				seen.add(key);
				variations[i].error = '';
			}
		});
	}

	function addVariation() {
		variations = [
			...variations,
			{
				color: '',
				length: '',
				type: '',
				thickness: '',
				price: '',
				discount_percentage: '',
				error: ''
			}
		];
	}

	function removeVariation(index: number) {
		variations = variations.filter((_, i) => i !== index);
		validateUniqueCombinations();
	}

	function handleSubmit(e: SubmitEvent) {
		validateUniqueCombinations();
		const hasErrors = variations.some(
			(v) => v.error || !v.color || !v.length || !v.type || !v.price
		);

		if (hasErrors) {
			e.preventDefault();
			alert('Please fix errors in variations.');
		}
	}

	onMount(() => {
		// Example onMount logic
	});
</script>

<h1 class="mb-2 mt-2 text-center text-2xl font-bold">Add a Product</h1>

{#if form?.success}
	<div class="alert alert-success mb-2">Product added successfully!</div>
{/if}

{#if form?.error}
	<div class="alert alert-error">
		{form.error}
	</div>
{/if}

<form method="POST" class="space-y-6 p-2" on:submit={handleSubmit}>
	<label class="input input-bordered flex items-center gap-2">
		Brand
		<input
			type="text"
			id="name"
			name="name"
			class="grow"
			placeholder="Eg. Finolex"
			bind:value={name}
			required
		/>
	</label>

	<label class="input input-bordered flex items-center gap-2">
		Description
		<input id="description" name="description" bind:value={description} class="grow" required />
	</label>

	<select
		id="selling_status"
		name="selling_status"
		bind:value={selling_status}
		class="max-w select select-bordered w-full"
		required
	>
		<option value="" disabled>Select Status</option>
		<option value="active">Active</option>
		<option value="inactive">Inactive</option>
	</select>

	<div class="space-y-4">
		<h3>Product Variations</h3>
		<button type="button" on:click={addVariation} class="btn rounded px-4 py-2">
			Add Variation
		</button>

		{#each variations as variation, i}
			<div class="space-y-4 rounded border p-4">
				<div class="flex justify-between">
					<h4>Variation {i + 1}</h4>
					<button type="button" on:click={() => removeVariation(i)} class="btn text-red-500">
						Remove
					</button>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label>Color</label>
						<select bind:value={variation.color} class="w-full rounded border p-2" required>
							<option value="" disabled>Select Color</option>
							{#each colors as color}
								<option value={color}>{color}</option>
							{/each}
						</select>
					</div>

					<div>
						<label>Length (Meters)</label>
						<select bind:value={variation.length} class="w-full rounded border p-2" required>
							<option value="" disabled>Select Length</option>
							{#each lengths as length}
								<option value={length}>{length}</option>
							{/each}
						</select>
					</div>

					<div>
						<label>Type</label>
						<select bind:value={variation.type} class="w-full rounded border p-2" required>
							<option value="" disabled>Select Type</option>
							{#each types as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>

					<div>
						<label>Thickness</label>
						<select bind:value={variation.thickness} class="w-full rounded border p-2" required>
							<option value="" disabled>Select Thickness</option>
							{#each thicknesses as thickness}
								<option value={thickness}>{thickness}</option>
							{/each}
						</select>
					</div>

					<div>
						<label>Discount Percentage</label>
						<input
							type="number"
							min="0"
							max="100"
							step="0.01"
							bind:value={variation.discount_percentage}
							class="w-full rounded border p-2"
							required
						/>
					</div>

					<div>
						<label>Price</label>
						<input
							type="number"
							min="0"
							step="0.01"
							bind:value={variation.price}
							class="w-full rounded border p-2"
							required
						/>
					</div>
				</div>

				{#if variation.error}
					<div class="text-sm text-red-500">{variation.error}</div>
				{/if}
			</div>
		{/each}
	</div>

	<input type="hidden" name="variations" value={JSON.stringify(variations)} />

	<button type="submit" class="w-full rounded py-2 text-white"> Save Product </button>
</form>

<style>
	h2 {
		font-size: 1rem;
		font-weight: 600;
		font-family: 'Poppins', sans-serif;
		text-align: center;
	}

	.alert {
		padding: 1rem;
		border-radius: 0.25rem;
		font-weight: bold;
	}

	.alert-success {
		background-color: #d4edda;
		color: #155724;
	}

	.alert-error {
		background-color: #f8d7da;
		color: #721c24;
	}

	button[type='submit'] {
		background-color: #047857;
		color: white;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
	}
	button[type='button'] {
		border: 1px solid #047857;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
	}
</style>
