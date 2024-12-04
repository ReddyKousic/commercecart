<script lang="ts">
    import type { Snippet } from 'svelte';
    import Credits from '$lib/components/Credits.svelte';
    import StoreDetails from '$lib/components/StoreDetails.svelte';
    import type { LayoutData } from './$types';

    let { data, children }: { data: LayoutData, children: Snippet } = $props();
</script>
<Credits />
<StoreDetails />
{@render children()}