<script>
	import { page } from '$app/stores';

	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-gray-100 px-4 py-10 text-gray-800">
	<div class="container mx-auto max-w-6xl">
		<div
			class="grid grid-cols-1 {!$page.url.pathname.includes('buy') ? 'md:grid-cols-2' : ''} gap-8"
		>
			<!-- Links Section -->
			<div class="mb-4 space-y-4">
				<h3 class="mb-4 text-lg font-bold text-gray-900">Quick Links</h3>
				<div class="grid grid-cols-2 gap-4">
					<a href="/" class="text-gray-600 transition-colors hover:text-red-600">Home</a>
					<a href="/info/contact" class="text-gray-600 transition-colors hover:text-red-600"
						>Contact Us</a
					>
					<a href="/info/about" class="text-gray-600 transition-colors hover:text-red-600"
						>About Us</a
					>
					<a href="/info/privacy" class="text-gray-600 transition-colors hover:text-red-600"
						>Privacy Policy</a
					>
					<a
						href="/info/cancellation-and-return"
						class="text-gray-600 transition-colors hover:text-red-600">Cancellation & Return</a
					>
					<a href="/info/shipping" class="text-gray-600 transition-colors hover:text-red-600"
						>Shipping Policy</a
					>
					<a href="/info/tnc" class="text-gray-600 transition-colors hover:text-red-600"
						>Terms & Conditions</a
					>
				</div>
			</div>

			<!-- Conditional Credits Section -->
			{#if !$page.url.pathname.includes('buy')}
				<div class="space-y-3 text-center md:text-right">
					<div class="text-2xl font-bold text-gray-900 gg">WireGuy Electricals Pvt Ltd.</div>
					<p class="text-gray-600">
						© {currentYear} All Rights Reserved
					</p>
					<div class="text-sm text-gray-500">
						Developed and Powered by
						<a
							href="https://koastec.com"
							class="playwrite-us-modern font-semibold hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							Koastec&#8482;
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</footer>

<style>
	.gg {
		font-family: 'Gowun Batang', serif;
	}

	.playwrite-us-modern {
		font-family: 'Playwrite US Modern', serif;
		font-optical-sizing: auto;
	}
</style>
