// partners/+page.server.ts

import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db'; // Assuming you have your db connection configured in lib/db
import { partners } from '$lib/server/db/schema'; // Assuming your schema is in lib/schema
import type { Actions } from './$types';
import { eq } from 'drizzle-orm';


export const load = (async () => {
    const allPartners = await db.select().from(partners);
    return {
        partners: allPartners

    };
}) satisfies PageServerLoad;


export const actions: Actions = {
    createPartner: async ({ request }) => {
        const formData = await request.formData();
        const partnerName = formData.get('partner_name');
        const partnerPhone = formData.get('partner_phone');
        const partnerCode = formData.get('partner_code');
        const overallDiscount = formData.get('overall_discount');

        if (!partnerName || !partnerCode) {
            return { success: false, error: 'Partner name and code are required.' };
        }

        await db.insert(partners).values({
            partner_name: partnerName.toString(),
            partner_phone: partnerPhone?.toString(),
            partner_code: partnerCode.toString(),
            overall_discount: overallDiscount ? overallDiscount.toString() : '0'
        });

        return { success: true };
    },

    updatePartner: async ({ request }) => {
        const formData = await request.formData();
        console.log(formData);
        const partnerId = formData.get('partner_id');
        const partnerName = formData.get('partner_name');
        const partnerPhone = formData.get('partner_phone');
        const partnerCode = formData.get('partner_code');
        const overallDiscount = formData.get('overall_discount');

        if (!partnerId || !partnerName || !partnerCode) {
            return { success: false, error: 'Partner ID, name, and code are required.' };
        }

        await db.update(partners).set({
            partner_name: partnerName.toString(),
            partner_phone: partnerPhone.toString(),
            partner_code: partnerCode.toString(),
            overall_discount: overallDiscount ? overallDiscount.toString() : '0'
        }).where(eq(partners.id, Number(partnerId)));

        return { success: true };
    },

    deletePartner: async ({ request }) => {
        const formData = await request.formData();
        const partnerId = formData.get('partner_id');

        if (!partnerId) {
            return { success: false, error: 'Partner ID is required.' };
        }

        await db.delete(partners).where(eq(partners.id, Number(partnerId)));

        return { success: true };
    }
};