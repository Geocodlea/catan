import { createVerificationsModel } from "@/utils/createModels";

global.models = global.models || {};

const Verificari_live_catan = createVerificationsModel("catan");
const Verificari_live_cavaleri = createVerificationsModel("cavaleri");
const Verificari_live_rentz = createVerificationsModel("rentz");
const Verificari_live_whist = createVerificationsModel("whist");

export {
  Verificari_live_catan,
  Verificari_live_cavaleri,
  Verificari_live_rentz,
  Verificari_live_whist,
};
