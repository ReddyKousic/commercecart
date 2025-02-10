<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="mb-2 mt-4 text-center text-2xl font-bold">Manage Servicable Locations</h1>

<div class="overflow-x-auto">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th></th>
				<th>Pincode</th>
				<th>Charge</th>
			</tr>
		</thead>
		<tbody>
			<!-- row 1 -->
			<tr>
				<th>1</th>
				<td>516172</td>
				<td>₹200</td>
			</tr>
			<!-- row 2 -->
			<tr>
				<th>2</th>
				<td>516171</td>
				<td>₹250</td>
			</tr>
			<!-- row 3 -->
			<tr>
				<th>3</th>
				<td>522321</td>
				<td>₹240</td>
			</tr>
		</tbody>
	</table>
</div>


<div class="flex justify-center items-center h-96">
    <div class="text-center">
        <h2 class="text-2xl font-bold">Under construction</h2>
        <p class="text-gray-500">This page is under construction</p>
    </div>
</div>
