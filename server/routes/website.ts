import { Elysia, status } from "elysia";
import { Website } from "../models/website";
import { Metric } from "../models/metric";
import { generateUniqueKey } from "../utils/key_maker";
import { withAuth } from "../middleware/auth";

export default new Elysia({ prefix: "/web" })
  .use(withAuth)
  .get("/", async ({ user, set }: any) => {
    if (!user) { set.status = 401; return { error: "Unauthorized" }; }
    const website = await Website.find({ dev: user.id });
    return { website };
  })
  .post("/", async ({ user, body, set }: any) => {
    if (!user) { set.status = 401; return { error: "Unauthorized" }; }
    try {
      const { url, desc } = body;
      if (!url) return status(400, { error: "Missing required fields" });
      if (await Website.findOne({ url })) return status(409, { error: "Website already exists" });

      const unique_key = generateUniqueKey(url);
      const website = new Website({ dev: user.id, url, desc, unique_key });
      await website.save();
      return status(201, { website });
    } catch {
      return status(500, { error: "Internal server error" });
    }
  })
  .put("/renew", async ({ user, body, set }: any) => {
    if (!user) { set.status = 401; return { error: "Unauthorized" }; }
    try {
      const { unique_key } = body;
      const website = await Website.findOne({ unique_key });
      if (!website) return status(404, { error: "Website not found" });

      const metrics = await Metric.find({ unique_key });
      let totalVisits = 0,
        uniqueVisitors = 0,
        totalSessionDuration = 0,
        totalBounceRate = 0;
      const referrersMap = new Map<string, number>();
      const deviceStats = { desktop: 0, mobile: 0, tablet: 0 };
      const pagesMap = new Map<
        string,
        { visits: number; avg_loading_time: number; avg_time_on_page: number }
      >();

      for (const m of metrics) {
        totalVisits += m.totalVisits;
        uniqueVisitors += m.uniqueVisitors;
        totalSessionDuration += m.avgSessionDuration;
        totalBounceRate += m.bounceRate;

        for (const ref of m.referrers || []) {
          if (!ref?.referrer) continue;
          referrersMap.set(
            ref.referrer,
            (referrersMap.get(ref.referrer) || 0) + (ref.count || 0)
          );
        }
        if (m.deviceStats) {
          deviceStats.desktop += m.deviceStats.desktop || 0;
          deviceStats.mobile += m.deviceStats.mobile || 0;
          deviceStats.tablet += m.deviceStats.tablet || 0;
        }
        for (const page of m.pages || []) {
          const u = page.url || "";
          if (!u) continue;
          const existing = pagesMap.get(u);
          if (existing) existing.visits += page.visits || 0;
          else pagesMap.set(u, { visits: page.visits || 0, avg_loading_time: 0, avg_time_on_page: 0 });
        }
      }

      const count = metrics.length;
      website.stats = {
        total_visits: totalVisits,
        monthly_visits: totalVisits,
        daily_visits: totalVisits,
        unique_visitors: uniqueVisitors,
        avg_session_duration: count > 0 ? totalSessionDuration / count : 0,
        bounce_rate: count > 0 ? totalBounceRate / count : 0,
        top_referrers: Array.from(referrersMap.entries())
          .map(([referrer, count]) => ({ referrer, count }))
          .sort((a, b) => b.count - a.count),
        device_distribution: deviceStats,
        pages: Array.from(pagesMap.entries()).map(([path, d]) => ({
          path,
          visits: d.visits,
          avg_loading_time: d.avg_loading_time,
          avg_time_on_page: d.avg_time_on_page,
        })),
      } as any;
      website.modified_at = new Date();
      await website.save();
      return { website };
    } catch {
      return status(500, { error: "Internal server error" });
    }
  })
  .put("/", async ({ user, body, set }: any) => {
    if (!user) { set.status = 401; return { error: "Unauthorized" }; }
    try {
      const { unique_key, url, desc } = body;
      if (!unique_key) return status(400, { error: "Unique key required" });

      const website = await Website.findOne({ unique_key });
      if (!website) return status(404, { error: "Website not found" });

      website.desc = desc || website.desc;
      website.url = url || website.url;
      await website.save();
      return { website };
    } catch {
      return status(500, { error: "Internal server error" });
    }
  })
  .delete("/", async ({ user, body, set }: any) => {
    if (!user) { set.status = 401; return { error: "Unauthorized" }; }
    try {
      const { unique_key } = body;
      if (!unique_key) return status(400, { error: "Unique key required" });

      const website = await Website.findOneAndDelete({ unique_key });
      if (!website) return status(404, { error: "Website not found" });

      await Metric.deleteMany({ unique_key: website.unique_key });
      return { message: "Website deleted" };
    } catch {
      return status(500, { error: "Internal server error" });
    }
  });
