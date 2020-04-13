import {
  overviewActionTypes,
  ressourceActionTypes,
  containerActionTypes,
} from "./containerData.types";

export const collectionSuccessOverview = (data) => ({
  type: overviewActionTypes.COLLECTION_SUCCESS_OVERVIEW,
  payload: data,
});

export const ressourceCollectionSuccess = (data) => ({
  type: ressourceActionTypes.COLLECTION_SUCCESS_RESSOURCE,
  payload: data,
});

export const containerLoadStart = (containerId) => ({
  type: containerActionTypes.CONTAINER_LOAD_START,
  payload: containerId,
});

export const containerLoadSuccess = (containerId) => ({
  type: containerActionTypes.CONTAINER_LOAD_SUCCESS,
  payload: containerId,
});

export const containerLoadFail = (containerId) => ({
  type: containerActionTypes.CONTAINER_LOAD_FAIL,
  payload: containerId,
});

export const renameContainerSuccess = (updatedContainer, server) => ({
  type: containerActionTypes.RENAME_CONTAINER_SUCCESS,
  payload: { updatedContainer, server },
});

export const startOrStopContainerSuccess = (updatedContainer, server) => ({
  type: containerActionTypes.START_OR_STOP_CONTAINER_SUCCESS,
  payload: { updatedContainer, server },
});

export const restartContainerSuccess = (updatedContainer, server) => ({
  type: containerActionTypes.RESART_CONTAINER_SUCCESS,
  payload: { updatedContainer, server },
});

export const removeContainerSuccess = (removedContainer, server) => ({
  type: containerActionTypes.REMOVE_CONTAINER_SUCCESS,
  payload: { removedContainer, server },
});
