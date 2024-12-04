<script>
    // Destructure the props to extract 'data' and set a fallback value
    let { data = { products: [] } } = $props();
  </script>
  
  <div class="mx-auto max-w-7xl px-4 py-8">
    {#if data?.products?.length === 0}
      <p class="text-gray-500">No products found</p>
    {:else}
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each data.products as product}
          <a
            href={`/manage/products/${product.id}`}
            class="block rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 class="text-xl font-semibold">{product.name}</h2>
            {#if product.description}
              <p class="mt-2 text-gray-600">{product.description}</p>
            {/if}
            <div class="mt-4 flex items-center justify-between">
              <span
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {product.selling_status === 'active' ? 'bg-green-100 text-green-800' : product.selling_status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}"
              >
                {product.selling_status}
              </span>
              <span class="text-sm text-gray-500">
                Added: {new Date(product.created_at).toLocaleDateString()}
              </span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
  