import mongoose from "mongoose";

import { ONE_DAY } from "src/utils/time/constants";

const now = Date.now();

const SessionSchema: mongoose.Schema = new mongoose.Schema({
  token: { type: String, required: true },
  iat: { type: Date, default: now, required: true },
  exp: { type: Date, default: now + ONE_DAY, required: true },
  userId: { type: String, required: true },
});

export default mongoose.model("Session", SessionSchema);
