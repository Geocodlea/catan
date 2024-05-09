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
      id: { type: String },
      round: { type: Number },
      stop: { type: Boolean },
      meci1: { type: String },
      meci2: { type: String },
      rude: { type: String },
      masa_redusa: { type: String },
    },
    { collection: `verificari_live_${event}` }
  );

  const modelName = `Verificari_live_${event}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

const createMatchesModel = (event, round) => {
  const schema = new mongoose.Schema(
    {
      id: { type: String },
      table: { type: Number },
      name: { type: String },
      scor: { type: String },
      host: { type: String },
      img: { type: String },
    },
    { collection: `meciuri_live_${event}_${round}` }
  );

  const modelName = `Meciuri_live_${event}_${round}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

const createClasamentModel = (event) => {
  const schema = new mongoose.Schema(
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    { collection: `clasament_live_${event}` }
  );

  const modelName = `Clasament_live_${event}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

export {
  createParticipantsModel,
  createAmicalModel,
  createVerificationsModel,
  createMatchesModel,
  createClasamentModel,
};
