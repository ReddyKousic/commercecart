<script lang="ts">
	import type { ActionData } from './$types';

	// const { form }: { form: ActionData | null } = $props();
	import CustomerLogin from '$lib/components/CustomerLogin.svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';

	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();
</script>

<StoreDetails logo={true} />

<div class="px-4">
	{#if form?.error}
		<div class="alert alert-error mt-4 p-4">
			{form.error}
		</div>
	{/if}
</div>

<CustomerLogin />
