<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Building2, Phone, Hash, Percent, DiamondPlus } from 'lucide-svelte';
	import type internal from 'stream';
	let { data }: { data: PageData } = $props();
	let error: string | null = null;
	let success: boolean | null = null;
	let addPartnerModal: HTMLDialogElement;
	let editPartnerModal: HTMLDialogElement;

	let partner_details = $state({
		id: 0,
		partner_name: '',
		partner_phone: '',
		partner_code: '',
		overall_discount: 0
	});

	const openaddPartnerModal = () => {
		addPartnerModal.showModal();
	};

	const closeaddPartnerModal = () => {
		addPartnerModal.close();
	};

	const openeditPartnerModal = (
		id: number,
		partner_name: string,
		partner_phone: string,
		partner_code: string,
		partner_discount: number
	) => {
		partner_details.id = id;
		partner_details.partner_name = partner_name;
		partner_details.partner_phone = partner_phone;
		partner_details.partner_code = partner_code;
		partner_details.overall_discount = partner_discount;

		editPartnerModal.showModal();
	};

	const closeeditPartnerModal = () => {
		editPartnerModal.close();
	};

	// onMount(() => {
	// 	openaddPartnerModal();

	// });
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
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="card rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
				onclick={() =>
					openeditPartnerModal(
						partner.id,
						partner.partner_name,
						partner.partner_phone,
						partner.partner_code,
						partner.overall_discount
					)}
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
						<p>{partner.partner_phone}</p>
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
		<h2 class="text-xl font-semibold">Create a New Partner</h2>

		<form
			method="post"
			onsubmit={() => {
				error = null;
				success = null;
			}}
		>
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
					min="1"
					max="80"
					required
				/>
			</div>

			<button type="submit" formaction="?/createPartner" class="btnx btn mt-6 w-full"
				>Create Partner</button
			>
		</form>
	</div>
</dialog>

<dialog
	id="checkoutLoginModal"
	class="modal modal-bottom sm:modal-middle"
	bind:this={editPartnerModal}
>
	<div class="modal-box">
		<h2 class="text-xl font-semibold">Edit or Delete Partner</h2>

		<form
			method="post"
			onsubmit={() => {
				error = null;
				success = null;
			}}
		>
			<input type="text" name="partner_id" value={partner_details.id} hidden />

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
					value={partner_details.partner_name}
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
					value={partner_details.partner_phone}
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
					value={partner_details.partner_code}
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
					min="1"
					max="80"
					required
					value={partner_details.overall_discount}
				/>
			</div>
			<div class="flex justify-between items-center buttons">
				<button type="submit" formaction="?/deletePartner" class="btn mt-6 border-red-800"
					>Delete</button
				>
				<button type="submit" formaction="?/updatePartner" class="btnx btn mt-6 "
					>Update Partner</button
				>
			</div>
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
