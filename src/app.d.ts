// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces


// src/types.ts

  
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {

				id: Number;
	
				phone: string;
	
				name: string;
	
				email: string;
	
				address: string;

				gstin: string;
	
			};
	
			storeManager?: {
	
				id: Number;
	
				phone: string;
	
				name: string;
	
			};
			manager?: {
	
				id: Number;
	
				phone: string;
	
				name: string;

				email: string;
	
			};
	
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
