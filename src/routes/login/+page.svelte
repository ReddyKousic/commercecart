<script lang="ts">
	import type { ActionData } from './$types';

	// const { form }: { form: ActionData | null } = $props();
	import CustomerLoginByPhone from '$lib/components/CustomerLoginByPhone.svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';

	import type { PageData } from './$types';

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
<CustomerLoginByPhone />
