<script>
    import Authentication from '$lib/assets/Authentication.png';
</script>

<section class="manage-login-form">
	<form action="?/ManageLogin" method="POST" class="flex flex-col items-center justify-center">
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
				autocomplete="on"
			/>
		</label>

		<div class="mt-6 flex w-full max-w-xs flex-col items-center justify-between gap-3">
			<button class="btn w-full" type="submit">Login</button>
			<button class="btn w-full" type="button">Recover?</button>
		</div>
	</form>
	<div class="flex justify-center items-center">
		<img src={Authentication} alt="Cart Illustration" class="h-80 mt-6" />

	</div>
    
</section>

<style>
	.manage-login-form {
		margin-top: 2svh;
	}

	button[type='submit'] {
		background-color: #047857;
		color: white;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
	}

	button[type='button'] {
		border: 1px solid #047857;
		font-family: 'Poppins', sans-serif;
		font-size: 16px;
	}
</style>
