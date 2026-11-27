import crypto from "node:crypto";
import { processDeliveryJobs } from "../server/delivery.js";
export default async function handler(request, response) {
  if (request.method !== "GET") { response.setHeader("Allow", "GET"); return response.status(405).json({ error: "Method not allowed" }); }
  const expected = Buffer.from(`Bearer ${process.env.CRON_SECRET || ""}`);
  const supplied = Buffer.from(request.headers.authorization || "");
  if (!process.env.CRON_SECRET || expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) return response.status(401).json({ error: "Unauthorized" });
  try { return response.status(200).json({ results: await processDeliveryJobs(null, 3) }); }
  catch { return response.status(503).json({ error: "Delivery retry failed." }); }
}
