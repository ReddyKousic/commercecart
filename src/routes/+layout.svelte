<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
	
	let { children } = $props();
</script>
<main>
	{@render children()}

</main>

<!-- <Footer /> -->


<style>
main {
	height: 100vh;
}
</style>