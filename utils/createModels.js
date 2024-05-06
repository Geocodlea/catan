import mongoose from "mongoose";

const createParticipantsModel = (event) => {
  const schema = new mongoose.Schema(
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      tel: { type: String },
      email: { type: String },
      obs: { type: String },
      rude: { type: String },
    },
    { collection: `participanti_live_${event}` }
  );

  const modelName = `Participanti_live_${event}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

const createAmicalModel = (event) => {
  const schema = new mongoose.Schema(
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      tel: { type: String },
      email: { type: String },
      obs: { type: String },
    },
    { collection: `amical_live_${event}` }
  );

  const modelName = `Amical_live_${event}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

const createVerificationsModel = (event) => {
  const schema = new mongoose.Schema(
    {
      id: { type: mongoose.Schema.Types.ObjectId },
      runda: { type: Number },
      stop: { type: Boolean },
    },
    { collection: `verificari_live_${event}` }
  );

  const modelName = `Verificari_live_${event}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

export { createParticipantsModel, createAmicalModel, createVerificationsModel };
