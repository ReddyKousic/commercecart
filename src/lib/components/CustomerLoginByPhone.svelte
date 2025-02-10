

<h1 class="text-2xl font-semibold text-center mt-4">Login/Singup</h1>

<section class="manage-login-form">
	<form action="?/validate" method="POST" class="flex flex-col items-center justify-center">
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

		<div class="mt-6 flex w-full max-w-xs flex-col items-center justify-between gap-3">
			<button class="btn w-full" type="submit">Send OTP</button>
			<p class="text-sm text-center">Logging in will automatically create an account.</p>

			<!-- <a href="/signup" class="w-full">
				<button class="btn w-full" type="button">Create an Account?</button>
			</a> -->


		</div>
	</form>
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
