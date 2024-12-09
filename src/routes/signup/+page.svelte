<script lang="ts">
	// import type { ActionData } from './$types';

	// const { form }: { form: ActionData | null } = $props();
	import CustomerSignUp from '$lib/components/CustomerSignUp.svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';

	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	type ActionData = {
		success?: boolean;
		message?: string;
		error: string;
		missingFields?: string[];
	};
</script>

<StoreDetails logo={true} />
<div class="px-4">
	{#if form?.error}
		<div class="alert alert-error mt-4 p-4">
			<p class="text-lg font-bold">{form.error}</p>
			{#if form.missingFields?.length}
				<ul class="mt-2 list-inside list-disc">
					{#each form.missingFields as field}
						<li class="capitalize">{field}</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>

<CustomerSignUp />
