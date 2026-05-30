import "./middleware/metric";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import mongoose from "mongoose";
import config from "./config/config";
import authRoutes from "./routes/auth";
import websiteRoutes from "./routes/website";
import metricRoutes from "./routes/metric";

mongoose
  .connect(config.db || "mongodb://localhost/Analytics")
  .then(() => console.log("✅ DB connected (mobile)"))
  .catch((err) => { console.error("❌ DB error:", err); process.exit(1); });

const app = new Elysia()
  .use(cors({ origin: true, credentials: true }))
  .use(authRoutes)
  .use(websiteRoutes)
  .use(metricRoutes)
  .listen(process.env.PORT || 3062);

console.log(`🚀 Mobile server running at http://localhost:${app.server?.port}`);
