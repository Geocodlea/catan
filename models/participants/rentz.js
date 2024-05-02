import mongoose from "mongoose";

global.models = global.models || {};

const ParticipantiLiveRentzSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    tel: { type: String },
    email: { type: String },
    obs: { type: String },
  },
  { collection: "participanti_live_rentz" }
);

// Check if the model already exists in global.models, if not, create it
global.models.ParticipantiLiveRentz =
  global.models.ParticipantiLiveRentz ||
  mongoose.model("ParticipantiLiveRentz", ParticipantiLiveRentzSchema);

export default global.models.ParticipantiLiveRentz;
