<script>
	import MainLogo from '$lib/assets/MainLogo.webp';
  
	// Props: 'logo' as true/false, 'name' for text fallback, 'address' for the address
	let { logo = false, name = "WireGuy", address = "101, Royal Enclave, New RTC colony, Patamata, Vijayawada 520007" } = $props();
  </script>
  
  <section class="name-address flex flex-col items-center justify-center">
	{#if logo}
	  <div class="name">
		<img src={MainLogo} alt="Logo" />
	  </div>
	{:else}
	  <p class="name">{name}</p>
	{/if}
	<p class="address">{address}</p>
  </section>
  
  <style>
	.name-address {
	  margin-top: 1svh;
	}
  
	.name {
	  font-family: 'Gowun Batang', serif;
	  font-weight: bold;
	  font-size: 40px;
	  text-align: center;
	}
  
	img {
	  width: 200px;
	  max-height: 80px; /* Ensures the logo doesn't stretch */
	  object-fit: contain;
	}
  
	.address {
	  font-family: 'Poppins', sans-serif;
	  font-size: 11px;
	  text-align: center;
	}
  </style>
  