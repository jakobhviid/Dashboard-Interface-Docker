import overviewTypes from "./overview.types";

export const stopCollectionOverview = () => ({
  type: overviewTypes.STOP_COLLECTING_OVERVIEW
});

export const collectionSuccessOverview = data => ({
  type: overviewTypes.COLLECTION_SUCCESS_OVERVIEW,
  payload: data
});
