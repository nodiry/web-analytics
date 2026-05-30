import { serve } from "bun";
import { MongoClient } from "mongodb";
import maxmind from "maxmind";
import config from "./config/config";

const client = new MongoClient(config.db || "mongodb://localhost/Analytics");
await client.connect();
const db = client.db("Analytics");
const trackCollection = db.collection("tracks");

const geoDb = await maxmind.open("./geoip.mmdb");

function getDeviceType(ua: string): "desktop" | "mobile" | "tablet" {
  if (/Mobi|Android/i.test(ua)) return "mobile";
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  return "desktop";
}

function getCountryFromIP(ip: string): string {
  if (!ip || ip === "unknown") return "Unknown";
  try {
    const lookup = geoDb.get(ip);
    return (lookup as any)?.country?.names?.en || "Unknown";
  } catch {
    return "Unknown";
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

serve({
  port: process.env.PORT || 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only accept POST /:uniqueKey (single path segment, no slashes)
    const unique = url.pathname.slice(1);
    if (req.method !== "POST" || !unique || unique.includes("/")) {
      return json({ error: "Not found" }, 404);
    }

    // Validate content type
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json") && !contentType.includes("text/plain")) {
      return json({ error: "Unsupported content type" }, 415);
    }

    try {
      let data: any;
      try {
        const text = await req.text();
        data = JSON.parse(text);
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }

      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

      const ua = data?.userAgent || req.headers.get("user-agent") || "unknown";

      await trackCollection.insertOne({
        unique_key: unique,
        url: typeof data?.url === "string" ? data.url : "unknown",
        referrer: typeof data?.referrer === "string" ? data.referrer : "direct",
        userAgent: ua,
        ip,
        loadTime: typeof data?.loadTime === "number" ? data.loadTime : 0,
        session_id: typeof data?.session_id === "string" ? data.session_id : "unknown-session",
        deviceType: data?.deviceType || getDeviceType(ua),
        country: getCountryFromIP(ip),
        timestamp: new Date(),
      });

      return json({ ok: true });
    } catch (err) {
      console.error("❌ Track error:", err);
      return json({ error: "Internal server error" }, 500);
    }
  },
});

console.log("🚀 Traffic server running");
