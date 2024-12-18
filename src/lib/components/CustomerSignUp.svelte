<script>
	import LoginIcon from '$lib/assets/LoginIcon.svelte';
</script>

<section class="manage-login-form">
	<form action="?/newAccount" method="POST" class="flex flex-col items-center justify-center">
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Name</span>
			</div>
			<input
				type="text"
				placeholder="Eg. MD Waasim"
				class="input input-bordered w-full max-w-xs"
				minlength="3"
				name="name"
			/>
		</label>
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Phone</span>
			</div>
			<input
				type="tel"
				placeholder="Eg. 9999999999"
				class="input input-bordered w-full max-w-xs"
				maxlength="10"
				minlength="10"
				name="phone"
				required
			/>
		</label>

		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Password</span>
			</div>
			<input
				type="password"
				placeholder="Eg. 98y(*Y9834y"
				class="input input-bordered w-full max-w-xs"
				minlength="6"
				name="password"
				required
			/>
		</label>

		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Re-type Password</span>
			</div>
			<input
				type="password"
				placeholder="Eg. 98y(*Y9834y"
				class="input input-bordered w-full max-w-xs"
				minlength="6"
				name="confirmPassword"
				required
			/>
		</label>

		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Email</span>
			</div>
			<input
				type="email"
				placeholder="Optional"
				class="input input-bordered w-full max-w-xs"
				name="email"
			/>
		</label>
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">GSTIN</span>
			</div>
			<input
				type="text"
				placeholder="Optional"
				class="input input-bordered w-full max-w-xs"
				name="gstin"
			/>
		</label>

		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Address</span>
			</div>
			<input
				type="text"
				placeholder="101, Royal Enclave, New RTC Colony, Patamata, Vijayawada, Andhra Pradesh 520010"
				class="input input-bordered w-full max-w-xs"
				minlength="4"
				maxlength="128"
				name="address"
			/>
		</label>

		<div class="mt-6 flex w-full max-w-xs flex-col items-center justify-between gap-3">
			<button class="btn w-full" type="submit">Create Account <LoginIcon /></button>
			<a href="/login" class="w-full">
				<button class="btn w-full" type="button">Login?</button>
			</a>
		</div>
	</form>

	<!-- <CustomerAuthentication /> -->
</section>

<style>
	.manage-login-form {
		margin-top: 2svh;
	}

	button[type='submit'] {
		background-color: #ed1c24;
		color: white;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
	}

	button[type='button'] {
		border: 1px solid black;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
	}
</style>
