import mongoose from "mongoose";

global.models = global.models || {};

const OldParticipantsSchema = new mongoose.Schema(
  {
    name: { type: String },
    data: { type: Array },
  },
  { collection: "old_participants" }
);

// Check if the model already exists in global.models, if not, create it
global.models.OldParticipants =
  global.models.OldParticipants ||
  mongoose.model("OldParticipants", OldParticipantsSchema);

export default global.models.OldParticipants;
