import mongoose from "mongoose";

global.models = global.models || {};

const OldEventsSchema = new mongoose.Schema(
  {
    name: { type: String },
    data: { type: Array },
  },
  { collection: "old_events" }
);

// Check if the model already exists in global.models, if not, create it
global.models.OldEvents =
  global.models.OldEvents || mongoose.model("OldEvents", OldEventsSchema);

export default global.models.OldEvents;
