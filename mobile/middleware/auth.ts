import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

const SAUCE = process.env.SAUCE || "chubingo";

// Shared derive logic — inlined per route file for proper TS inference.
// This helper is used as a mixin in website.ts and metric.ts.
export const withAuth = (app: Elysia) =>
  app
    .use(jwt({ name: "jwt", secret: SAUCE, exp: "1d" }))
    .derive(async ({ jwt, cookie, request }) => {
      const cookieRaw = (cookie as any).Authorization?.value ?? "";
      const cookieToken = cookieRaw.replace("Bearer ", "");
      const headerToken =
        request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
      const token = cookieToken || headerToken;
      if (!token) return { user: null as { id: string; username: string } | null };
      const payload = await jwt.verify(token);
      return {
        user: payload
          ? (payload as { id: string; username: string })
          : (null as { id: string; username: string } | null),
      };
    });
