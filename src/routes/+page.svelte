<script lang="ts">
	import PublicProductsList from '$lib/components/PublicProductsList.svelte';
	import StoreDetails from '$lib/components/StoreDetails.svelte';
	import Cart from '$lib/components/Cart.svelte';

	import type { PageData } from './$types';
	import PublicMenu from '$lib/components/PublicMenu.svelte';
	import Footer from '$lib/components/Footer.svelte';
	export let data: PageData;
</script>
<StoreDetails logo={true} />
<PublicMenu {data} currentPage={"home"}/>

<PublicProductsList {data} />

<Footer />

