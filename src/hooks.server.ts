import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { customers, store_managers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {

    // const userAgent = event.request.headers.get('user-agent') || '';
    // const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);

    // // Redirect non-mobile users to /not-supported
    // if (!isMobile && !event.url.pathname.startsWith('/not-supported')) {
    //     throw redirect(303, '/not-supported');
    // }
    
    const customerSessionId = event.cookies.get('sessionId');
    const managerSessionId = event.cookies.get('storeManagerSessionId');
    
    // Handle customer authentication
    if (customerSessionId) {
        const userRecord = await db.select().from(customers)
            .where(eq(customers.sessionId, customerSessionId))
            .limit(1);
            
        if (userRecord.length > 0) {
            event.locals.user = {
                id: userRecord[0].id,
                phone: userRecord[0].phone,
                name: userRecord[0].name,
                email: userRecord[0].email ,
                address: userRecord[0].address ,
                gstin: userRecord[0].gstin

            };
            
            // Redirect authenticated customers away from login
            if (event.url.pathname === '/login') {
                throw redirect(303, '/');
            }
        } else {
            // Clear invalid customer session
            event.cookies.delete('sessionId', {
                path: '/',
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });
        }
    }

    // Handle store manager authentication
    if (managerSessionId) {
        const managerRecord = await db.select().from(store_managers)
            .where(eq(store_managers.sessionId, managerSessionId))
            .limit(1);
            
        if (managerRecord.length > 0) {
            event.locals.manager = {
                id: managerRecord[0].id,
                phone: managerRecord[0].phone,
                name: managerRecord[0].name,
                email: managerRecord[0].email || "No Email provided"
            };
            
            // Redirect authenticated managers away from login
            if (event.url.pathname === '/manage/login') {
                throw redirect(303, '/manage');
            }
        } else {
            // Clear invalid manager session
            event.cookies.delete('storeManagerSessionId', {
                path: '/',
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });
        }
    }

    // Protected routes handling
    if (event.url.pathname.startsWith('/account')) {
        if (!customerSessionId || !event.locals.user) {
            throw redirect(303, '/');
        }
    }

    if (event.url.pathname.startsWith('/manage')) {
        // Exclude the login page from protection
        if (event.url.pathname !== '/manage/login') {
            if (!managerSessionId || !event.locals.manager) {
                throw redirect(303, '/manage/login');
            }
        }
    }

    return await resolve(event);
};