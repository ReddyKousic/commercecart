<script lang="ts">
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';

	import {
		Package,
		PlusCircle,
		Users,
		HandshakeIcon,
		Tags,
		Ellipsis,
		IndianRupee,
		MapPin,
		ChartNoAxesCombined
	} from 'lucide-svelte';

	// Define admin navigation items with paths and Lucide icon components
	const menuItems = [
		{
			path: '/manage/products',
			label: 'Products',
			icon: Tags
		},
		{
			path: '/manage/orders',
			label: 'Orders',
			icon: Package
		},
		{
			path: '/manage/products/add',
			label: 'New',
			icon: PlusCircle
		},
		{
			path: '/manage/customers',
			label: 'Customers',
			icon: Users
		}
		// {
		// 	path: '/manage/partners',
		// 	label: 'Partners',
		// 	icon: HandshakeIcon
		// }
	];

	// Check if current path is active
	const isActive = (path: string) => $page.url.pathname === path;

	// Show all items except login page
	$: isLoginPage = $page.url.pathname === '/manage/login';

	// Store to track drawer state
	const isDrawerOpen = writable(false);

	// Open drawer function
	function openDrawer() {
		isDrawerOpen.set(true);
	}

	// Close drawer function
	function closeDrawer() {
		isDrawerOpen.set(false);
	}

	// openDrawer();
</script>

<nav class="mb-4">
	{#if isLoginPage}
		<p class="w-full text-center text-gray-800">Please log in to manage your store</p>
	{:else}
		<div class="menu flex flex-row items-center justify-between gap-2">
			{#each menuItems as { path, label, icon: Icon }}
				<a
					href={path}
					class="menu-item btnx btn flex-1 transform transition-all duration-200"
					class:active={isActive(path)}
					aria-current={isActive(path) ? 'page' : undefined}
				>
					<span class="icon-wrapper">
						<svelte:component this={Icon} size={18} strokeWidth={2} />
					</span>
				</a>
			{/each}
			<button
				class="menu-item btnx btn flex-1 transform transition-all duration-200"
				on:click={openDrawer}><Ellipsis /></button
			>
		</div>
	{/if}
</nav>
<div class="drawer">
	<!-- Bind checked state to the store -->
	<input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={$isDrawerOpen} />
	<div class="drawer-content">
		<!-- Page content here -->
	</div>
	<div class="drawer-side">
		<button aria-label="close sidebar" class="drawer-overlay" on:click={closeDrawer}></button>

		<div class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			<a href="/manage/partners" class="btn flex justify-start text-lg shadow-none">
				<HandshakeIcon strokeWidth={1} />
				<span>Partners</span>
			</a>
			<hr />

			<a href="/manage/payments" class="btn flex justify-start text-lg shadow-none">
				<IndianRupee strokeWidth={1} />
				<span>Payments</span>
			</a>
			<hr />

			<a href="/manage/locations" class="btn flex justify-start text-lg shadow-none">
				<MapPin strokeWidth={1} />
				<span>Locations</span>
			</a>
			<hr />

			<a href="/manage/analytics" class="btn flex justify-start text-lg shadow-none">
				<ChartNoAxesCombined strokeWidth={1} />
				<span>Analytics</span>
			</a>
			<hr />
		</div>
	</div>
</div>
<hr  />

<style>
	.drawer {
		z-index: 1000;
	}
	.menu {
		position: relative;
		padding: 0.5rem;
	}

	.btnx {
		background-color: #047857;
		color: white;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
		border-radius: 20px;
		padding: 0.75rem 1rem;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		position: relative;
		overflow: hidden;
	}

	.btnx:hover {
		background-color: #065f46;
		transform: translateY(-1px);
	}

	.drawerbtn {
		background-color: #047857;
		color: white;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
		border-radius: 20px;
		padding: 0.75rem 1rem;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: start;
		gap: 0.5rem;
		position: relative;
		overflow: hidden;
	}

	.drawerbtn:hover {
		background-color: #065f46;
		transform: translateY(-1px);
	}

	.btnx.active {
		background-color: #064e3b;
		font-weight: 500;
	}

	.btnx.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40%;
		height: 2px;
		background-color: white;
		border-radius: 2px;
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.9;
	}

	.label {
		font-size: 0.95em;
		letter-spacing: 0.02em;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.btnx {
			padding: 0.5rem;
			font-size: 14px;
		}

		.icon-wrapper {
			margin-right: -0.25rem;
		}

		.label {
			font-size: 0.85em;
		}
	}
</style>
