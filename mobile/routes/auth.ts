import { Elysia, status } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { OAuth2Client } from "google-auth-library";
import { Dev } from "../models/dev";
import { Quick } from "../models/quick";
import { Website } from "../models/website";
import { Metric } from "../models/metric";
import { hash, verify } from "../utils/hash";
import { generatePasscode } from "../utils/key_maker";
import { send } from "../middleware/emailer";
import logger from "../middleware/logger";

const SAUCE = process.env.SAUCE || "chubingo";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const setAuthCookie = (cookie: any, token: string) => {
  cookie.Authorization.value = `Bearer ${token}`;
  cookie.Authorization.httpOnly = true;
  cookie.Authorization.secure = process.env.NODE_ENV === "production";
  cookie.Authorization.sameSite = "strict";
  cookie.Authorization.maxAge = 86400;
};

export default new Elysia({ prefix: "/auth" })
  .use(jwt({ name: "jwt", secret: SAUCE, exp: "1d" }))
  // Google Sign-In
  .post("/google/signin", async ({ jwt, cookie, body }: any) => {
    try {
      const { token } = body;
      if (!token) return status(400, { error: "No Google token provided." });

      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) return status(400, { error: "Invalid Google token" });

      const user = await Dev.findOne({ email: payload.email });
      if (!user) return status(404, { error: "User not found. Please sign up first." });

      if (!user.authorized) {
        const code = generatePasscode();
        await send(user.email, code);
        await new Quick({ email: user.email, passcode: code }).save();
        return { user: "twoauth" };
      }

      const authToken = await jwt.sign({ id: user._id.toString(), username: user.username });
      setAuthCookie(cookie, authToken);
      const web = await Website.find({ dev: user._id });
      user.password = "";
      return { user, web };
    } catch (err) {
      logger.error("Google Sign-In Error: " + err);
      return status(500, { error: "Google authentication failed" });
    }
  })
  // Google Sign-Up
  .post("/google/signup", async ({ jwt, cookie, body }: any) => {
    try {
      const { token } = body;
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) return status(400, { error: "Invalid Google token" });

      const { sub, email, name, picture } = payload;
      let user = await Dev.findOne({ email });

      if (!user && email) {
        user = new Dev({
          googleId: sub,
          email,
          username: email.split("@")[0],
          firstname: name || "",
          lastname: "",
          img_url: picture || "",
          authorized: true,
        });
        await user.save();
      }
      if (!user?._id) return status(500, { error: "User creation failed." });

      const authToken = await jwt.sign({ id: user._id.toString(), username: user.username });
      setAuthCookie(cookie, authToken);
      return { user, web: [] };
    } catch (err) {
      logger.error("Google Auth Error: " + err);
      return status(500, { error: "Google authentication failed" });
    }
  })
  // Sign Up
  .post("/signup", async ({ body }: any) => {
    try {
      const { username, firstname, email, lastname, password } = body;
      if (!username || !password || !email)
        return status(400, { error: "Missing required fields" });

      if (await Dev.findOne({ username }))
        return status(409, { error: "Username already taken" });
      if (await Dev.findOne({ email }))
        return status(409, { error: "Email already registered" });

      const hashed = await hash(password);
      await new Dev({
        username,
        firstname: firstname || "",
        lastname: lastname || "",
        password: hashed,
        email,
      }).save();
      return status(201, { message: "User created successfully" });
    } catch (err) {
      return status(500, { error: "Internal server error" });
    }
  })
  // Sign In
  .post("/signin", async ({ jwt, cookie, body }: any) => {
    try {
      const { email, password } = body;
      if (!email || !password)
        return status(400, { error: "Missing required fields" });

      const user = await Dev.findOne({ email });
      if (!user) return status(401, { error: "Invalid credentials" });

      const isValid = await verify(password, user.password || "");
      if (!isValid) return status(401, { error: "Invalid credentials" });

      if (!user.authorized) {
        const code = generatePasscode();
        await send(user.email, code);
        await new Quick({ email: user.email, passcode: code }).save();
        return { user: "twoauth" };
      }

      const token = await jwt.sign({ id: user._id.toString(), username: user.username });
      setAuthCookie(cookie, token);
      const web = await Website.find({ dev: user._id });
      user.password = "";
      return { user, web };
    } catch (err) {
      logger.error("Signin Error: " + err);
      return status(500, { error: "Internal server error" });
    }
  })
  // Two-Factor Auth
  .post("/twoauth", async ({ jwt, cookie, body }: any) => {
    try {
      const { email, passcode } = body;
      if (!email || !passcode)
        return status(400, { error: "Missing required fields" });

      const found = await Quick.findOneAndDelete({ email });
      if (!found) return status(401, { error: "Invalid credentials" });
      if (found.passcode !== Number(passcode))
        return status(403, { error: "Invalid passcode" });

      const user = await Dev.findOne({ email });
      if (!user) return status(404, { error: "User not found" });

      user.authorized = true;
      await user.save();

      const token = await jwt.sign({ id: user._id.toString(), username: user.username });
      setAuthCookie(cookie, token);
      const web = await Website.find({ dev: user._id });
      user.password = "";
      return { user, web };
    } catch (err) {
      logger.error("TwoAuth Error: " + err);
      return status(500, { error: "Internal server error" });
    }
  })
  // Forgot Password — sends OTP, no JWT cookie set here
  .post("/forgot", async ({ body }: any) => {
    try {
      const { email } = body;
      if (!email) return status(400, { error: "Email required" });

      const user = await Dev.findOne({ email });
      if (!user) return status(404, { error: "User not found" });

      const code = generatePasscode();
      await send(user.email, code);
      await new Quick({ email: user.email, passcode: code }).save();
      return { go: "twoauth" };
    } catch (err) {
      logger.error("Forgot Error: " + err);
      return status(500, { error: "Internal server error" });
    }
  })
  // Edit User
  .put("/user", async ({ body }: any) => {
    try {
      const { username, firstname, lastname, email, img, password } = body;
      if (!username) return status(400, { error: "Username required" });

      const found = await Dev.findOne({ username });
      if (!found) return status(404, { error: "User not found" });

      found.firstname = firstname || found.firstname;
      found.lastname = lastname || found.lastname;
      found.email = email || found.email;
      found.img_url = img || found.img_url;
      if (password) found.password = await hash(password);
      found.modified_at = new Date();
      await found.save();
      found.password = "";
      return { user: found };
    } catch (err) {
      return status(500, { error: "Internal server error" });
    }
  })
  // Delete User
  .delete("/user", async ({ body }: any) => {
    try {
      const { username } = body;
      if (!username) return status(400, { error: "Username required" });

      const user = await Dev.findOne({ username });
      if (!user) return status(404, { error: "User not found" });

      const websites = await Website.find({ dev: user._id });
      await Promise.all(
        websites.map(async (w) => {
          await Metric.deleteMany({ unique_key: w.unique_key });
          await Website.deleteOne({ unique_key: w.unique_key });
        })
      );
      await Dev.deleteOne({ username });
      return { message: "Account deleted successfully" };
    } catch (err) {
      logger.error("Delete User Error: " + err);
      return status(500, { error: "Internal server error" });
    }
  })
  // Logout
  .post("/logout", ({ cookie }: any) => {
    cookie.Authorization.remove();
    return { message: "Logged out successfully" };
  });
