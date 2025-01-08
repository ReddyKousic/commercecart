<script>
	import CustomerAuthentication from '$lib/assets/CustomerAuthentication.svelte';
	import LoginIcon from '$lib/assets/LoginIcon.svelte';
</script>

<section class="manage-login-form">
	<form action="?/login" method="POST" class="flex flex-col items-center justify-center">
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
			/>
		</label>

		<div class="mt-6 flex w-full max-w-xs flex-col items-center justify-between gap-3">
			<button class="btn w-full" type="submit">Login <LoginIcon /></button>
			<a href="/signup" class="w-full">
				<button class="btn w-full" type="button">Create an Account?</button>
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
