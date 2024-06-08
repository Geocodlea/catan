import mongoose from "mongoose";

global.models = global.models || {};

const LeaderboardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    nume: { type: String, required: true },
    puncte: { type: Number, required: true },
    numeJoc: { type: String },
  },
  { collection: "leaderboard" }
);

// Check if the model already exists in global.models, if not, create it
global.models.Leaderboard =
  global.models.Leaderboard || mongoose.model("Leaderboard", LeaderboardSchema);

export default global.models.Leaderboard;
