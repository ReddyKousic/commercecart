<script>
	import { vibrate } from '$lib';

	let { data = { products: [], user: {} } } = $props();

	// State for popup
	let showPopup = $state(false);
	let popupMessage = $state('');

	// Sort products: inactive ones go to the bottom
	let sortedProducts = data.products.sort(
		(/** @type {{ selling_status: string; }} */ a, /** @type {{ selling_status: string; }} */ b) =>
			a.selling_status === 'inactive' && b.selling_status !== 'inactive'
				? 1
				: a.selling_status !== 'inactive' && b.selling_status === 'inactive'
					? -1
					: 0
	);

	function handleInactiveClick() {
		popupMessage = 'This product is not available right now and will be back soon.';
		showPopup = true;
		vibrate();
	}

	function closePopup() {
		showPopup = false;
		popupMessage = '';
	}
</script>
<!-- 
{#if data.user}
	<div class="bg-gray-100 py-4 text-center">
		<div class="mx-auto max-w-7xl px-4">
			<h1 class="text-2xl font-semibold">Welcome, {data.user.name}</h1>
		</div>
	</div>
{/if} -->

<div class="mx-auto max-w-7xl px-4 py-8">
	{#if sortedProducts?.length === 0}
		<p class="text-center text-gray-500">No products found</p>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each sortedProducts as product}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="block rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
					onclick={product.selling_status === 'inactive' ? handleInactiveClick : null}
				>
					<a
						href={product.selling_status === 'active' ? `/buy/${product.id}` : null}
						class={`${product.selling_status === 'inactive' ? 'pointer-events-none' : ''}`}
					>
						<h2 class="text-xl font-semibold">{product.name}</h2>
						{#if product.description}
							<p class="mt-2 text-gray-600">{product.description}</p>
						{/if}
						<div class="mt-4 flex items-center justify-between">
							<span
								class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {product.selling_status ===
								'active'
									? 'bg-green-100 text-green-800'
									: 'bg-red-100 text-red-800'}"
							>
								{product.selling_status}
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
	{/if}

	{#if showPopup}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="rounded-lg bg-white p-4 shadow-lg">
				<p class="text-gray-800">{popupMessage}</p>
				<button class="mt-4 rounded bg-blue-600 px-4 py-2 text-white" onclick={closePopup}>
					Close
				</button>
			</div>
		</div>
	{/if}
</div>
