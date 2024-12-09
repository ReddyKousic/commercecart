<script lang="ts">
	// import type { PageData } from '../$types';

	type Customer = {
		id: number;
		name: string;
		email: string;
		phone: string;
		address: string;
	};

	type PageData = {
		customers: Customer[];
	};

	let { data }: { data: PageData } = $props();
</script>

<!-- 
data.customers = [
  {
    id: 4,
    name: 'Kousic Reddy',
    email: 'kousicreddy2211@gmail.com',
    phone: '9542623606',
    address: '13/336-2,Sri Ram Nagar,kadapa road,mydukur'
  },
  {
    id: 5,
    name: 'Test User',
    email: 'kousicreddy2211@gmail.com',
    phone: '9014226298',
    address: '13/336-2,Sri Ram Nagar,kadapa road,mydukur'
  }
]





-->
<h1 class="mb-2 mt-4 text-center text-2xl font-bold">All registered customers</h1>

<section class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
	{#if data.customers.length > 0}
		{#each data.customers as customer}
			<div class="the-list-item rounded-lg bg-white p-6">
				<div class="flex items-center">
					<!-- You can use any icons library of your choice -->
					<h3 class="text-lg font-semibold">{customer.name}</h3>
				</div>

				<div class="flex items-center">
					<p class="text-sm text-gray-600">{customer.email}</p>
				</div>

				<div class="flex items-center">
					<p class="text-sm text-gray-600">{customer.phone}</p>
				</div>

				<div class="flex items-center">
					<p class="text-sm text-gray-600">{customer.address}</p>
				</div>
			</div>
		{/each}
	{:else}
		<p class="mt-4 text-center">You have no registered customers yet</p>
	{/if}
</section>

<style>
	.the-list-item {
		border: 1px solid #e2e8f0;
	}
</style>
