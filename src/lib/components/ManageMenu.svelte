<script>
	import { page } from '$app/stores';

	let currentPage = $state($page.url.pathname);

	$effect(() => {
		currentPage = $page.url.pathname;
	});

	// Menu items with their respective paths and labels
	const menuItems = [
		{ path: '/manage/orders', label: 'Orders' },
		{ path: '/manage/products/add', label: 'New' },
		{ path: '/manage/customers', label: 'Customers' },
		{ path: '/manage/products', label: 'Products' }
	];

	// Function to determine which items to show
	function getVisibleMenuItems() {
		// Filter out the current page's menu item
		return menuItems.filter(item => item.path !== currentPage);
	}
</script>

<div class="menu flex flex-row items-center justify-between gap-2">
	{#if currentPage === '/manage/login'}
		<p class="text-gray-500 text-center w-full">Please log in to manage your store</p>
	{:else}
		{#each getVisibleMenuItems() as item}
			<a
				href={item.path}
				class="menu-item btn flex-1 rounded-sm p-2 text-center"
			>
				{item.label}
			</a>
		{/each}
	{/if}
</div>

<hr class="mt-2" />

<style>
	.btn {
		background-color: #047857;
		color: white;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
		border-radius: 20px;
	}

</style>
