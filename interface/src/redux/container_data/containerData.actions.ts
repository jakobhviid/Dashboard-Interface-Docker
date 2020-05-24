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

export const containerLoadStart = (containerIds:string[]) => ({
  type: containerActionTypes.CONTAINER_LOAD_START,
  payload: containerIds,
});

export const containerLoadFinished = (containerIds:string[]) => ({
  type: containerActionTypes.CONTAINER_LOAD_FINISHED,
  payload: containerIds,
});
