<script>
	import CartIcon from '$lib/assets/CartIcon.svelte';

	let { data = { user: {} }, currentPage = 'home' } = $props();
</script>

<hr class="mb-2 mt-2" />

<div class="menu flex flex-row items-center justify-between gap-2">
	<!-- Dynamic Buttons -->
	{#if currentPage === 'cart'}
		<a href="/" class="menu-item btn flex-1 rounded-sm p-2 text-center">Home</a>
		{#if data.user}
			<a href="/account" class="menu-item btn flex-1 rounded-sm p-2 text-center">Account</a>
			<a href="/account/orders" class="menu-item btn flex-1 rounded-sm p-2 text-center">Orders</a>
		{:else}
			<a href="/login" class="menu-item btn flex-1 rounded-sm p-2 text-center">Login</a>
		{/if}
	{:else if currentPage === 'buy'}
		<a href="/" class="menu-item btn flex-1 rounded-sm p-2 text-center">Home</a>
		<a href="/cart" class="menu-item btn flex-1 rounded-sm p-2 text-center">Cart & Quote</a>
	{:else if currentPage === 'account'}
		<a href="/cart" class="menu-item btn flex-1 rounded-sm p-2 text-center">Cart</a>
		<a href="/" class="menu-item btn flex-1 rounded-sm p-2 text-center">Home</a>
		{#if data.user}
			<a href="/account/orders" class="menu-item btn flex-1 rounded-sm p-2 text-center">Orders</a>
		{:else}
			<a href="/login" class="menu-item btn flex-1 rounded-sm p-2 text-center">Login</a>
		{/if}
	{:else if currentPage === 'orders'}
		<a href="/cart" class="menu-item btn flex-1 rounded-sm p-2 text-center">Cart</a>
		<a href="/" class="menu-item btn flex-1 rounded-sm p-2 text-center">Home</a>
		{#if data.user}
			<a href="/account" class="menu-item btn flex-1 rounded-sm p-2 text-center">Account</a>
		{:else}
			<a href="/login" class="menu-item btn flex-1 rounded-sm p-2 text-center">Login</a>
		{/if}
	{:else if currentPage === 'home'}
		<a href="/cart" class="menu-item btn flex-1 rounded-sm p-2 text-center">Cart & Quote</a>
		{#if data.user}
			<a href="/account" class="menu-item btn flex-1 rounded-sm p-2 text-center">Account</a>
			<a href="/account/orders" class="menu-item btn flex-1 rounded-sm p-2 text-center">Orders</a>
		{:else}
			<a href="/login" class="menu-item btn flex-1 rounded-sm p-2 text-center">Login</a>
		{/if}
	{/if}
</div>

<!-- User Message -->
{#if data.user}
	<p class="mt-2 text-center">Welcome, {data.user.name}</p>
{:else}
	<p class="mt-2 text-center">Please login to view your account</p>
{/if}

<hr class="mt-2" />

<style>
	.btn {
		background-color: #ed1c24;
		color: white;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
		border-radius: 20px;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
