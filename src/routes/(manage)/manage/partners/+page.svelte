<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
    let error: string | null = null;
    let success: boolean | null = null;
</script>

<main class="p-6 bg-base-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Partners</h1>

    <!-- Form to create a new partner -->
    <form 
        method="post" 
        class="card p-6 mb-8 space-y-4 border"
        on:submit={() => { error = null; success = null; }}>
        <h2 class="text-xl font-semibold">Create a New Partner</h2>
        <div class="form-control">
            <label class="label" for="partner_name">
                <span class="label-text">Partner Name</span>
            </label>
            <input type="text" id="partner_name" name="partner_name" class="input input-bordered w-full" required />
        </div>

        <div class="form-control">
            <label class="label" for="partner_phone">
                <span class="label-text">Partner Phone</span>
            </label>
            <input type="text" id="partner_phone" name="partner_phone" class="input input-bordered w-full" />
        </div>

        <div class="form-control">
            <label class="label" for="partner_code">
                <span class="label-text">Partner Code</span>
            </label>
            <input type="text" id="partner_code" name="partner_code" class="input input-bordered w-full" required />
        </div>

        <div class="form-control">
            <label class="label" for="overall_discount">
                <span class="label-text">Overall Discount (%)</span>
            </label>
            <input 
                type="number" 
                id="overall_discount" 
                name="overall_discount" 
                class="input input-bordered w-full" 
                step="0.01" 
                min="0" />
        </div>

        <button type="submit" formaction="?/createPartner" class="btn w-full">Create Partner</button>
    </form>

    {#if error}
        <p class="text-error font-semibold">{error}</p>
    {/if}
    {#if success}
        <p class="text-success font-semibold">Partner created successfully!</p>
    {/if}

    <!-- List of partners -->
    <section class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {#each data.partners as partner}
            <div class="card  border">
                <div class="card-body">
                    <h3 class="card-title">{partner.partner_name}</h3>
                    <p><strong>Phone:</strong> {partner.partner_phone || 'N/A'}</p>
                    <p><strong>Code:</strong> {partner.partner_code}</p>
                    <p><strong>Discount:</strong> {partner.overall_discount}%</p>
                    <p><small class="text-sm text-gray-500">Created At: {partner.created_at}</small></p>
                </div>
            </div>
        {/each}
    </section>
</main>

<style>
   
   .btn {
        background-color: #047857;
        color: white;
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
        padding: 0.75rem 1rem;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        position: relative;
        overflow: hidden;
    }
</style>
