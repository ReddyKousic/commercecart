<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    onMount(() => {
        goto('/info/careers/');

    });
</script>