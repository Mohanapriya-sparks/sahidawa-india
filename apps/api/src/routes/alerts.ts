import { Router, Request, Response } from "express";
import { supabase } from "../db/client";
import webpush from "web-push";

// Configure web-push with VAPID details
if (process.env.WEB_PUSH_VAPID_PUBLIC_KEY && process.env.WEB_PUSH_VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        process.env.WEB_PUSH_CONTACT || "mailto:support@sahidawa.in",
        process.env.WEB_PUSH_VAPID_PUBLIC_KEY,
        process.env.WEB_PUSH_VAPID_PRIVATE_KEY
    );
}


const alertsRouter = Router();

/**
 * GET /api/v1/alerts
 * Paginated alerts endpoint.
 *
 * Query params:
 *   page  — 1-based page index (default: 1)
 *   limit — items per page (default: 10, max: 100)
 *
 * Response schema:
 *   {
 *     data:           Alert[],
 *     pageIndex:      number,   // current page (1-based)
 *     pageSize:       number,   // items returned on this page
 *     totalCount:     number,   // total rows in the table
 *     totalPageCount: number,   // ceil(totalCount / limit)
 *   }
 */
alertsRouter.get("/", async (req: Request, res: Response) => {
    const rawPage = parseInt(req.query.page as string, 10);
    const rawLimit = parseInt(req.query.limit as string, 10);

    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const limit = isNaN(rawLimit) || rawLimit < 1 ? 10 : Math.min(rawLimit, 100);

    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
        .from("drug_alerts")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        res.status(500).json({ error: "Failed to fetch alerts" });
        return;
    }

    const totalCount = count ?? 0;
    const totalPageCount = Math.ceil(totalCount / limit);

    res.json({
        data: data ?? [],
        pageIndex: page,
        pageSize: (data ?? []).length,
        totalCount,
        totalPageCount,
    });
});

/**
 * POST /api/v1/alerts/ingest
 * Protected endpoint to ingest parsed CDSCO alerts from the ML agent.
 */
alertsRouter.post("/ingest", async (req: Request, res: Response) => {
    // 1. Validate Secret Header
    const authHeader = req.headers["x-api-secret"];
    const expectedSecret = process.env.API_SECRET_KEY || "secret-key-123";

    if (!authHeader || authHeader !== expectedSecret) {
        res.status(401).json({ error: "Unauthorized access" });
        return;
    }

    const { alerts } = req.body;
    if (!alerts || !Array.isArray(alerts)) {
        res.status(400).json({ error: "Invalid payload: Expected an array of alerts" });
        return;
    }

    try {
        // 2. Insert alerts into drug_alerts table
        const { data: insertedAlerts, error: insertError } = await supabase
            .from("drug_alerts")
            .insert(alerts)
            .select();

        if (insertError) {
            console.error("Error inserting alerts:", insertError);
            res.status(500).json({ error: "Database error inserting alerts" });
            return;
        }

        // 3. Update medicines table based on matched batches
        for (const alert of alerts) {
            if (alert.batch) {
                await supabase
                    .from("medicines")
                    .update({ status: "recalled", is_counterfeit_alert: true })
                    .eq("batch_number", alert.batch);
            }
        }

        // 4. Dispatch Web Push Notifications
        const { data: subscriptions, error: subError } = await supabase
            .from("push_subscriptions")
            .select("*");

        if (!subError && subscriptions && subscriptions.length > 0) {
            const pushPayload = JSON.stringify({
                title: "New CDSCO Drug Alert",
                body: `A new drug recall has been issued. Check the alerts page for details.`,
                icon: "/icon.png", // Assuming an icon exists at this route
                url: "/alerts"
            });

            const pushPromises = subscriptions.map((sub: any) => {
                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                };
                return webpush.sendNotification(pushSubscription, pushPayload).catch(err => {
                    console.error("Error sending push notification to endpoint:", sub.endpoint, err);
                });
            });

            await Promise.all(pushPromises);
        }

        res.status(200).json({ success: true, message: "Alerts ingested and notifications dispatched", inserted: insertedAlerts?.length });
    } catch (error) {
        console.error("Unexpected error in /ingest:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default alertsRouter;