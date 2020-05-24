import {
  overviewActionTypes,
  ressourceActionTypes,
  containerActionTypes,
} from "./containerData.types";

export const collectionSuccessOverview = (data:any) => ({
  type: overviewActionTypes.COLLECTION_SUCCESS_OVERVIEW,
  payload: data,
});

export const ressourceCollectionSuccess = (data:any) => ({
  type: ressourceActionTypes.COLLECTION_SUCCESS_RESSOURCE,
  payload: data,
});

export const containerLoadStart = (containerId:string) => ({
  type: containerActionTypes.CONTAINER_LOAD_START,
  payload: containerId,
});

export const containerLoadFinished = (containerId:string) => ({
  type: containerActionTypes.CONTAINER_LOAD_FINISHED,
  payload: containerId,
});
