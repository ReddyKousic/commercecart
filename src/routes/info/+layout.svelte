<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import StoreDetails from '$lib/components/StoreDetails.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<StoreDetails logo={true} />
<hr class="mt-4">

{@render children()}
