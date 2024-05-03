import mongoose from "mongoose";

export const createParticipantsModel = (event) => {
  const schema = new mongoose.Schema(
    {
      id: { type: String },
      name: { type: String },
      tel: { type: String },
      email: { type: String },
      obs: { type: String },
    },
    { collection: `participanti_live_${event}` }
  );

  const modelName = `Participanti_live_${event}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};
