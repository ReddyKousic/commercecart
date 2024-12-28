import { partners } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';


// Server-side code to handle the GET request
export async function GET({ params }) {
    // Extract the partner_code from the route parameters
    const { partner_code } = params;

    try {
        // Query the database to find the partner by partner_code
        const partnerDetails = await db.select().from(partners).where(eq(partners.partner_code, partner_code)).execute();

        if (partnerDetails.length === 0) {
            return new Response('Partner not found', { status: 404 });
        }

        // Return the partner details as a JSON response
        return new Response(JSON.stringify(partnerDetails[0]), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching partner details:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}