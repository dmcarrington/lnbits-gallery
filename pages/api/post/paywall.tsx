import {client, Connect} from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    var paywall = ""
    try {
        //const body = JSON.parse(req.body);
        const { public_id, url } = req.body;
        console.log("Received data:", { public_id, url });
        
        // post the paywall request to lnbits
        const lnbits_url = process.env.LNBITS_URL + "/paywall/api/v1/paywalls";
        const lnbits_api_key = process.env.LNBITS_API_KEY || "";
        const paywall_amount = process.env.PAYWALL_AMOUNT || 1000; // default to 1000 satoshis
        console.log("Paywall amount:", paywall_amount);
        console.log("LNBITS URL:", lnbits_url);
        console.log("LNBITS API Key:", lnbits_api_key);
        const paywall_request = {
            url: url,
            memo: "gallery_" + public_id,
            description: "gallery_" + public_id,
            amount: paywall_amount,
            remembers: true,
        }
        await fetch(lnbits_url, {
            method: "POST",
            headers: {"X-Api-Key": lnbits_api_key, "Content-Type": "application/json"},
            body: JSON.stringify(paywall_request),
        })
        .then(async (response) => {
            if (!response.ok) {
                console.error("Error creating paywall:", response.statusText);
                throw new Error("Network response was not ok");
            }
            const paywall_resp = await response.json();
            const paywall_id = paywall_resp.id;
            paywall = process.env.LNBITS_URL + "/paywall/" + paywall_id;
            console.log("Paywall URL:", paywall);
            
            await Connect();
            //const mongoClient = client;
            const db = client.db("lnbits-gallery");
            const paywall_doc = await db
            .collection("gallery")
            .insertOne({
                public_id,
                url,
                paywall,
                createdAt: new Date(),
            });
        res.json(paywall_doc);

        })
        .catch((error) => {
            console.error("Error:", error);
            // handle error
            res.status(500).json({ error: "Error creating paywall" });
        });

        
    } catch (e) {
        console.error(e);
    }
}