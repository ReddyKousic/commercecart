<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

  
  <section class="bg-base-200 text-base-content py-10">
    <div class="container mx-auto px-4 space-y-8">
      <!-- Title -->
      <h1 class="text-3xl md:text-4xl font-bold text-center">About Us</h1>
  
      <!-- Introduction -->
      <p class="text-lg md:text-xl text-center">
        Welcome to <span class="font-semibold">WIREGUY</span>, your trusted partner in high-quality electrical wires and cables!
      </p>
  
      <!-- Content -->
      <div class="space-y-6">
        <!-- Who We Are -->
        <p>
          At <span class="font-semibold">WIREGUY</span>, we understand that reliable wiring is the backbone of any home, building, or industrial project. That’s why we are committed to delivering top-notch electrical wires designed to ensure safety, efficiency, and durability for all your construction and industrial needs.
        </p>
  
        <!-- Who We Serve -->
        <h2 class="text-2xl font-semibold">Who We Serve</h2>
        <p>
          Whether you’re building your dream home, managing a construction project, or running a factory, we’ve got you covered. Our extensive range of wires caters to homeowners, contractors, and industries alike. No matter the size or complexity of your project, we’re here to provide solutions that power your vision.
        </p>
  
        <!-- Why Choose Us -->
        <h2 class="text-2xl font-semibold">Why Choose Us?</h2>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Quality You Can Trust:</strong> Our wires meet the highest safety standards and are built to last.</li>
          <li><strong>Wide Selection:</strong> We offer a variety of wires for residential, commercial, and industrial applications.</li>
          <li><strong>Customer-Centric Approach:</strong> We’re not just about selling wires; we’re about building long-lasting relationships. Our friendly team is always ready to help you choose the right product for your needs.</li>
          <li><strong>Affordable Pricing:</strong> High quality doesn’t have to mean high cost. We offer competitive pricing to suit every budget.</li>
        </ul>
  
        <!-- Our Mission -->
        <h2 class="text-2xl font-semibold">Our Mission</h2>
        <p>
          Our mission is simple: to empower your projects with reliable electrical solutions while ensuring safety and satisfaction. We believe that every wire we provide contributes to the comfort, efficiency, and success of our customers.
        </p>
      </div>
  
      <!-- Closing Note -->
      <p class="text-center text-lg">
        Thank you for choosing <span class="font-semibold">WIREGUY</span>. Let’s build something great together!
      </p>
      <p class="text-center">
        If you have any questions or need assistance, don’t hesitate to reach out. We’re always here to help.
      </p>
    </div>
  </section>
  
  <Footer />