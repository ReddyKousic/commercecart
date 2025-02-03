<script lang="ts">
	import StoreDetails from '$lib/components/StoreDetails.svelte';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();
</script>

<StoreDetails logo={true} />

<hr class="mt-2" />
<div class="px-4">
	{#if form?.error}
		<div class="alert alert-error mt-4 p-4">
			{form.error}
		</div>
	{/if}
</div>
<section class="manage-login-form">
	<form action="?/verify" method="POST" class="flex flex-col items-center justify-center">
		<label class="form-control w-full max-w-xs">
			<input
				type="tel"
				placeholder="Eg. 9999999999"
				class="input input-bordered w-full max-w-xs text-center"
				maxlength="10"
				minlength="10"
				value="OTP sent to {data.phone}"
				required
				disabled
			/>
		</label>

		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Enter OTP</span>
			</div>
			<input
				type="tel"
				placeholder="Eg. 2839"
				class="input input-bordered w-full max-w-xs"
				maxlength="4"
				minlength="4"
				name="otp"
				required
			/>
		</label>

		<div class="mt-6 flex w-full max-w-xs flex-col items-center justify-between gap-3">
			<button class="btn w-full" type="submit">Login</button>
		</div>
	</form>
</section>

<style>
	.manage-login-form {
		margin-top: 2svh;
	}

	button[type='submit'] {
		background-color: #ed1c24;
		color: white;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
	}

	.resend-button {
		font-family: 'Poppins', sans-serif;
		font-size: 10px;
		opacity: 0.7;
		transition: all 0.3s ease;
	}

	.resend-button:disabled {
		cursor: not-allowed;
	}

	.resend-button:not(:disabled) {
		opacity: 1;
		text-decoration: underline;
	}
</style>
