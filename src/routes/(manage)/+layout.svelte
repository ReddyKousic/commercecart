<script lang="ts">
	import type { Snippet } from 'svelte';
	import Credits from '$lib/components/Credits.svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';
	import type { LayoutData } from './$types';
	import ManageMenu from '$lib/components/ManageMenu.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<!-- <Credits /> -->
<StoreDetails />
<hr class="mt-2 mb-2" />

<ManageMenu />
{@render children()}
