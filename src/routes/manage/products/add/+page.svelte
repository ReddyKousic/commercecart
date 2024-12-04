<script lang="ts">
    import type { ActionData } from './$types';
	import { vibrate } from '$lib';
	import { onMount } from 'svelte';
    export let form: ActionData | null; // Form data returned by the server

    const colors = ['Red', 'Black', 'Green', 'Blue', 'Yellow'];
    const lengths = ['90', '180'];
    const types = ['FR', 'FRLS'];

    let name = '';
    let description = '';
    let selling_status = 'active';
    let variations: { color: string; length: string; type: string; price: string }[] = [];
    const allCombinations = colors.flatMap(color =>
        lengths.flatMap(length => types.map(type => ({ color, length, type })))
    );

    function addVariation() {
        const usedCombinations = variations.map(v => `${v.color}-${v.length}-${v.type}`);
        const nextCombination = allCombinations.find(
            combo => !usedCombinations.includes(`${combo.color}-${combo.length}-${combo.type}`)
        );

        if (nextCombination) {
            variations = [...variations, { ...nextCombination, price: '' }];
        } else {
            alert('All variations have been added.');
        }
    }

    function removeVariation(index: number) {
        variations = variations.filter((_, i) => i !== index);
    }

    function handleSubmit(e: SubmitEvent) {
        if (variations.length === 0) {
            e.preventDefault();
            alert('Please add at least one variation');
            return;
        }

        const hasEmptyFields = variations.some(v => !v.color || !v.length || !v.type || !v.price);

        if (hasEmptyFields) {
            e.preventDefault();
            alert('Please fill all fields in variations');
        }
    }

    onMount(() => {
		vibrate();		
	});
</script>

<hr class="mt-2 mb-2" />
<h2>Add Product</h2>
<hr class="mt-2 mb-2" />

 {#if form?.success}
    <div class="alert alert-success mb-2">
        Product added successfully!
    </div>
 {/if}

{#if form?.error}
    <div class="alert alert-error">
        {form.error}
    </div>
{/if}

<form method="POST" class="space-y-6" on:submit={handleSubmit}>
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
        class="select select-bordered w-full max-w"
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
                        <select bind:value={variation.color} class="w-full rounded border p-2" disabled>
                            {#each colors as color}
                                <option value={color}>{color}</option>
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label>Length (Meters)</label>
                        <select bind:value={variation.length} class="w-full rounded border p-2" disabled>
                            {#each lengths as length}
                                <option value={length}>{length}</option>
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label>Type</label>
                        <select bind:value={variation.type} class="w-full rounded border p-2" disabled>
                            {#each types as type}
                                <option value={type}>{type}</option>
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label>Price</label>
                        <input type="number" bind:value={variation.price} class="w-full rounded border p-2" required />
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <input type="hidden" name="variations" value={JSON.stringify(variations)} />

    <button type="submit" class="w-full rounded py-2 text-white">
        Save Product
    </button>
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
