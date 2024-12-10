<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	import MainLogo from '$lib/assets/MainLogo.png';
</script>

<div class="not-supported">
	<img src={MainLogo} alt="" class="w-1/4" />
	<h1>This application is only available for small screens.</h1>
	<a href="https://koastec.com" class="text-sm text-black">
		<p class="underline">Koastec - High Performance Systems</p>
	</a>
</div>

<style>
	.not-supported {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		height: 100vh;
		text-align: center;
	}
</style>
