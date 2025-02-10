<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Building2, Phone, Hash, Percent, DiamondPlus } from 'lucide-svelte';
	export let data: PageData;
	let error: string | null = null;
	let success: boolean | null = null;
	let addPartnerModal: HTMLDialogElement;


	const openaddPartnerModal = () => {
		addPartnerModal.showModal();
	};

	const closeaddPartnerModal = () => {
		addPartnerModal.close();
	};
	onMount(() => {
		openaddPartnerModal();

	});
</script>

<div class="flex items-center justify-between px-4">
	<h1 class="mb-2 mt-4 text-center text-2xl font-bold">Partners</h1>
	<button class="btn btn-circle" onclick={openaddPartnerModal}><DiamondPlus /></button>
</div>

<main class="min-h-screen bg-base-100 px-4 py-2">
	<!-- Form to create a new partner -->

	{#if error}
		<p class="font-semibold text-error">{error}</p>
	{/if}
	{#if success}
		<p class="font-semibold text-success">Partner created successfully!</p>
	{/if}

	<!-- List of partners -->
	<section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.partners as partner}
			<div
				class="card rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
			>
				<div class="space-y-4 p-6">
					<!-- Partner Name -->
					<div class="flex items-center gap-3">
						<Building2 class="text-primary-600 h-5 w-5" />
						<h3 class="text-xl font-semibold text-gray-900">{partner.partner_name}</h3>
					</div>

					<!-- Phone -->
					<div class="flex items-center gap-3 text-gray-600">
						<Phone class="h-4 w-4" />
						<p>{partner.partner_phone || 'N/A'}</p>
					</div>

					<!-- Partner Code -->
					<div class="flex items-center gap-3 text-gray-600">
						<Hash class="h-4 w-4" />
						<p class="font-mono">{partner.partner_code}</p>
					</div>

					<!-- Discount -->
					<div class="mt-2 flex items-center gap-3">
						<div class="bg-primary-50 text-primary-700 flex items-center gap-2 rounded-full py-1">
							<Percent class="h-4 w-4" />
							<p class="font-semibold">{partner.overall_discount}</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</section>
</main>

<dialog
	id="checkoutLoginModal"
	class="modal modal-bottom sm:modal-middle"
	bind:this={addPartnerModal}
>
	<div class="modal-box">
		<h3 class="mt-4 text-lg font-bold">Login</h3>

		<form
			method="post"
			class="card mb-8 space-y-4 border p-6"
			onsubmit={() => {
				error = null;
				success = null;
			}}
		>
			<h2 class="text-xl font-semibold">Create a New Partner</h2>
			<div class="form-control">
				<label class="label" for="partner_name">
					<span class="label-text">Partner Name</span>
				</label>
				<input
					type="text"
					id="partner_name"
					name="partner_name"
					class="input input-bordered w-full"
					minlength="3"
					maxlength="100"
					required
				/>
			</div>

			<div class="form-control">
				<label class="label" for="partner_phone">
					<span class="label-text">Partner Phone</span>
				</label>
				<input
					type="text"
					id="partner_phone"
					name="partner_phone"
					class="input input-bordered w-full"
					maxlength="10"
					minlength="10"
					required
				/>
			</div>

			<div class="form-control">
				<label class="label" for="partner_code">
					<span class="label-text">Partner Code</span>
				</label>
				<input
					type="text"
					id="partner_code"
					name="partner_code"
					class="input input-bordered w-full"
					minlength="3"
					maxlength="15"
					required
				/>
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
					step="2"
					min="1"
					max="80"
					required
				/>
			</div>

			<button type="submit" formaction="?/createPartner" class="btnx w-full">Create Partner</button>
		</form>
	</div>
</dialog>

<style>
	.btnx {
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
