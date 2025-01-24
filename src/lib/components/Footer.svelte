<script>
	const currentYear = new Date().getFullYear();
</script>

<footer class="footer bg-base-200 py-8 text-base-content px-4">
	<div
		class="container mx-auto flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0"
	>
		<!-- Links Section -->
		<div
			class="footer-links flex flex-col space-y-2 text-center md:flex-row md:space-x-6 md:space-y-0"
		>
			<a href="/info/about" class="link-hover link text-sm">About Us</a>
			<a href="/info/privacy" class="link-hover link text-sm">Privacy Policy</a>
			<a href="/info/cancellation-and-return" class="link-hover link text-sm">Cancellation and Return Policy</a>
			<a href="/info/shipping" class="link-hover link text-sm">Shipping Policy</a>
			<a href="/info/tnc" class="link-hover link text-sm">Terms and Conditions</a>
		</div>

		<!-- Credit Section -->
		<div class="credit text-center text-sm text-gray-500">
			© {currentYear} <span class="font-semibold">WireGuy Electricals Pvt Ltd.</span> <br />
			Developed and Powered by
			<a href="https://koastec.com" class="font-semibold hover:underline">Koastec</a>.
		</div>
	</div>
</footer>
