<script lang="ts">
	import PublicMenu from '$lib/components/PublicMenu.svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PublicMenu {data} currentPage={'account'} />

<!-- <h1 class="text-center text-2xl font-bold mt-4">Your Orders</h1> -->

{#if data.user}
	<section class="ac_details p-4">
		<h1 class="mt-4 text-center text-2xl font-bold">Your Account</h1>
		<label class="form-control">
			<div class="label">
				<span class="label-text">Name</span>
			</div>
			<input
				type="text"
				placeholder="Your name"
				value={data.user.name}
				class="input input-bordered"
				readonly
			/>
		</label>

		<label class="form-control">
			<div class="label">
				<span class="label-text">Phone</span>
			</div>
			<input
				type="text"
				placeholder="Phone"
				value={data.user.phone}
				class="input input-bordered"
				readonly
			/>
		</label>

		<label class="form-control">
			<div class="label">
				<span class="label-text">Email</span>
			</div>
			<input
				type="text"
				placeholder="Your email"
				value={data.user.email}
				class="input input-bordered"
				readonly
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
				readonly
			></textarea>
		</label>
	</section>
{/if}
