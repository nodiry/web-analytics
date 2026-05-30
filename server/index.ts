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
  .then(() => console.log("✅ DB connected"))
  .catch((err) => { console.error("❌ DB error:", err); process.exit(1); });

const app = new Elysia()
  .use(cors({
    origin: process.env.ORIGIN || "https://analytics.glasscube.io",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }))
  .use(authRoutes)
  .use(websiteRoutes)
  .use(metricRoutes)
  .listen(process.env.PORT || 3003);

console.log(`🚀 Server running at http://localhost:${app.server?.port}`);
