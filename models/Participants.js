import { createParticipantsModel } from "@/utils/createModels";

global.models = global.models || {};

const Participanti_live_catan = createParticipantsModel("catan");
const Participanti_live_cavaleri = createParticipantsModel("cavaleri");
const Participanti_live_rentz = createParticipantsModel("rentz");
const Participanti_live_whist = createParticipantsModel("whist");

export {
  Participanti_live_catan,
  Participanti_live_cavaleri,
  Participanti_live_rentz,
  Participanti_live_whist,
};
