<script lang="ts">
    import { page } from '$app/stores';
    import CartIcon from '$lib/assets/CartIcon.svelte';
    let { data = { user: {} } } = $props();

    // Define navigation items with their paths and labels
    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/cart', label: 'Cart' },
        { path: '/account/orders', label: 'Orders', requiresAuth: true },
        { path: '/login', label: 'Login', hideIfAuth: true },
        { path: '/account', label: 'Account', requiresAuth: true },

    ];

    // Helper function to check if a path is active
    const isActive = (path: string) => {
        return $page.url.pathname === path;
    };

    // Filter navigation items based on auth status
    $effect(() => {
        return navItems.filter(item => {
            if (item.requiresAuth && !data.user) return false;
            if (item.hideIfAuth && data.user) return false;
            return true;
        });
    });
</script>

<hr class="mb-2 mt-2" />
<nav class="menu flex flex-row items-center justify-between gap-2">
    {#each navItems as { path, label, requiresAuth, hideIfAuth }}
        {#if (!requiresAuth || data.user) && (!hideIfAuth || !data.user)}
            <a
                href={path}
                class="menu-item btn flex-1 rounded-sm p-2 text-center transition-all duration-300"
                class:active={isActive(path)}
                aria-current={isActive(path) ? 'page' : undefined}
            >
                {label}
            </a>
        {/if}
    {/each}
</nav>

<!-- User Message -->
{#if data.user}
    <p class="mt-2 text-center text-sm text-gray-700">Welcome, {data.user.name}</p>
{:else}
    <p class="mt-2 text-center text-sm text-gray-600">Please login to view your account</p>
{/if}
<hr class="mt-2" />

<style>
    .btn {
        background-color: #ed1c24;
        color: white;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        border-radius: 20px;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .btn:hover {
        /* transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(237, 28, 36, 0.2); */
    }

    .btn.active {
        /* background-color: #c41017;
        box-shadow: 0 0 15px rgba(237, 28, 36, 0.4); */
        font-weight: 500;
    }

    .btn.active::after {
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

    /* Smooth transitions */
    .btn {
        /* transition: all 0.2s ease-in-out; */
    }

    /* @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(237, 28, 36, 0.4); }
        50% { box-shadow: 0 0 15px rgba(237, 28, 36, 0.6); }
        100% { box-shadow: 0 0 5px rgba(237, 28, 36, 0.4); }
    } */

    .btn.active {
        animation: glow 2s infinite;
    }
</style>