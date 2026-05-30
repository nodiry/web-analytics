import mongoose from "mongoose";

const devSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, immutable: true },
  firstname: { type: String, default: "" },
  lastname: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: "" },
  googleId: { type: String, default: "" },
  created_at: { type: Date, default: Date.now, immutable: true },
  modified_at: { type: Date },
  img_url: { type: String, default: "" },
  authorized: { type: Boolean, default: false },
});

export const Dev = mongoose.model("Dev", devSchema);
