// import { fail, redirect, type Actions } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';
// import { db } from '$lib/server/db';
// import { store_managers } from '$lib/server/db/schema';
// import { eq, and } from 'drizzle-orm';
// import { randomBytes } from 'crypto';

// function generateSessionId(): string {
//     return randomBytes(32).toString('hex');
// }

// function getSessionExpiration(): Date {
//     const expirationDate = new Date();
//     expirationDate.setDate(expirationDate.getDate() + 15); // Add 15 days
//     return expirationDate;
// }

// export const load = (async () => {
//     return {};
// }) satisfies PageServerLoad;

// // ManageLogin Action

// export const actions: Actions = {
//     ManageLogin: async ({ cookies, request }) => {
//         const formData = await request.formData();
//         const phone = formData.get('phone') as string || '';
//         const password = formData.get('password') as string || '';

//         // Validation
//         if (!phone || !password) {
//             return fail(400, {
//                 error: 'Phone and password are required.',
//                 missing: !phone ? 'phone' : 'password'
//             });
//         }

//         let storeManagerId: number | null = null;
//         let sessionId: string | null = null;

//         try {
//             // Find the store manager with matching credentials
//             const manager = await db.select()
//                 .from(store_managers)
//                 .where(
//                     and(
//                         eq(store_managers.phone, phone),
//                         eq(store_managers.password, password)
//                     )
//                 )
//                 .limit(1);

//             console.log('Store Manager lookup result:', manager);

//             if (manager.length === 0) {
//                 console.log('Invalid credentials');
//                 return fail(401, {
//                     error: 'Invalid credentials or account does not exist',
//                 });
//             }

//             // Generate new session
//             sessionId = generateSessionId();
//             const sessionEOL = getSessionExpiration();

//             // Update manager with new session data
//             await db.update(store_managers)
//                 .set({
//                     sessionId: sessionId,
//                     sessionEOL: sessionEOL
//                 })
//                 .where(eq(store_managers.id, manager[0].id));

//             storeManagerId = manager[0].id;

//             // Set session cookie
//             cookies.set('storeManagerSessionId', sessionId, {
//                 path: '/',
//                 httpOnly: true,
//                 secure: false,
//                 sameSite: 'strict',
//                 maxAge: 60 * 60 * 24 * 15 // 15 days in seconds
//             });

//             console.log('ManageLogin successful:', {
//                 id: storeManagerId,
//                 sessionId,
//                 sessionEOL
//             });

//         } catch (error) {
//             console.error('Error during ManageLogin:', error);
//             return fail(500, { error: 'Internal server error. Please try again later.' });
//         }

//         // Redirect on success
//         if (storeManagerId && sessionId) {
//             throw redirect(302, '/dashboard'); // Adjust redirect path as needed
//         }

//         // Fallback error if we somehow get here
//         return fail(500, { error: 'Failed to complete login process.' });
//     }
// };
