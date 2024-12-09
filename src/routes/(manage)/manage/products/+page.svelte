<script lang="ts">
	import ManageMenu from '$lib/components/ManageMenu.svelte';
	import ProductsList from '$lib/components/ProductsList.svelte';

	import { vibrate } from '$lib';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		vibrate();
	});
</script>


<ProductsList {data} />
