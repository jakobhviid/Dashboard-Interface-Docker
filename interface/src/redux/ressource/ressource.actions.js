import ressourceTypes from "./ressource.types";

export const stopCollectingRessource = () => ({
  type: ressourceTypes.STOP_COLLECTING_RESSOURCE
});

export const ressourceCollectionSuccess = data => ({
  type: ressourceTypes.COLLECTION_SUCCESS_RESSOURCE,
  payload: data
});
