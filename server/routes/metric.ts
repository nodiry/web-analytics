import { Elysia, status } from "elysia";
import { Metric } from "../models/metric";
import { withAuth } from "../middleware/auth";

export default new Elysia({ prefix: "/metric" })
  .use(withAuth)
  .get("/:userId/:unique/:period", async ({ user, params, set }: any) => {
    if (!user) { set.status = 401; return { error: "Unauthorized" }; }

    const { userId, unique, period } = params;
    if (userId !== user.id) { set.status = 403; return { error: "Forbidden" }; }

    const periodNum = parseInt(period, 10);
    const now = new Date();

    if (periodNum === 1) {
      const metrics = await Metric.find({
        unique_key: unique,
        timestamp: { $gte: new Date(now.getTime() - 86_400_000) },
      });
      return { metrics };
    }
    if (periodNum === 2) {
      const metrics = await Metric.find({
        unique_key: unique,
        timestamp: { $gte: new Date(now.getTime() - 604_800_000) },
      });
      return { metrics };
    }
    if (periodNum === 3) {
      const metrics = await Metric.find({
        unique_key: unique,
        timestamp: { $gte: new Date(now.getTime() - 2_592_000_000) },
      });
      return { metrics };
    }
    if (periodNum === 4) {
      const metrics = await Metric.find({ unique_key: unique });
      return { metrics };
    }

    return status(400, { error: "Invalid period. Use 1 (24h), 2 (7d), 3 (30d), 4 (all)." });
  });
