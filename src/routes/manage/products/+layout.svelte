<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<hr class="mt-2" />
<section class="p-2">
	<!-- <h2>Product Management</h2> -->


	{@render children()}
</section>

<style>
	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		font-family: 'Poppins', sans-serif;
		text-align: center;
	}
</style>
