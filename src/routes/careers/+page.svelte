<script lang="ts">
	import StoreDetails from '$lib/components/StoreDetails.svelte';

	interface Job {
		id: number;
		name: string;
		description?: string;
		location: string;
		salary: string;
		experience: string;
		age?: string;
		status: 'active' | 'inactive';
		created_at: string;
	}

	const jobs: Job[] = [
		{
			id: 1,
			name: 'Marketing Executive',
			description: '',
			location: 'AP & Telangana',
			salary: '₹25,000',
			experience: '1-5 Years',
			age: '22-35',
			status: 'active',
			created_at: '2025-02-03T12:00:00Z'
		},
		{
			id: 2,
			name: 'Customer Care Executive',
			description: '',
			location: 'Vijayawada',
			salary: '₹15,000',
			experience: '2-5 years',
			age: '22-35',
			status: 'active',
			created_at: '2025-01-15T12:00:00Z'
		}
	];

	const filteredProducts = jobs;

	function handleInactiveClick() {
		console.log('Clicked on an inactive job');
	}
</script>

<StoreDetails logo={true} />
<hr class="mt-4" />
<section class="mx-auto max-w-7xl px-4 py-4">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredProducts as product}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="block rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
				onclick={product.status === 'inactive' ? handleInactiveClick : null}
			>
				<a
					href={product.status === 'active' ? `/buy/${product.id}` : null}
					class={`${product.status === 'inactive' ? 'pointer-events-none' : ''}`}
				>
					<h2 class="text-xl font-semibold">{product.name}</h2>
					{#if product.description}
						<p class="mt-2 text-gray-600">{product.description}</p>
					{/if}
					<div class="mt-2 space-y-1">
						<p class="text-gray-700"><strong>Location:</strong> {product.location}</p>
						<p class="text-gray-700"><strong>Salary:</strong> {product.salary}</p>
						<p class="text-gray-700"><strong>Experience:</strong> {product.experience}</p>
						{#if product.age}
							<p class="text-gray-700"><strong>Age:</strong> {product.age}</p>
						{/if}
					</div>
					<div class="mt-4 flex items-center justify-between">
						<span
							class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {product.status ===
							'active'
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'}"
						>
							{product.status}
						</span>
						<span class="text-sm text-gray-500">
							{new Date(product.created_at).toLocaleDateString('en-US', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							})}
						</span>
					</div>
				</a>
			</div>
		{/each}
	</div>
</section>