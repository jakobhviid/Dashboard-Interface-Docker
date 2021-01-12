import produce from "immer";
import { overviewActionTypes, ressourceActionTypes, containerActionTypes } from "./containerData.types";
import { IContainerDataState, ReducerAction } from "../../types/redux/reducerStates.types";
import { SOCKET_SERVER_UPDATES_ENDPOINT } from "../../api/endpoints";

const signalR = require("@microsoft/signalr");

const INITIAL_STATE: IContainerDataState = {
  socketConnection: undefined,
  overviewData: {},
  statsData: {},
  loadingContainers: [],
};

const addCommandTopicToContainers = (containers: any, payload: any) => {
  for (const container of containers) {
    if (payload.commandRequestTopic && payload.commandResponseTopic) {
      container["commandRequestTopic"] = payload.commandRequestTopic;
      container["commandResponseTopic"] = payload.commandResponseTopic;
    }
  }
};

const containerDataReducer = (state = INITIAL_STATE, action: ReducerAction) => {
  switch (action.type) {
    case overviewActionTypes.COLLECTION_SUCCESS_OVERVIEW:
      addCommandTopicToContainers(action.payload.containers, action.payload);
      return produce(state, (nextState) => {
        nextState.overviewData[action.payload.servername] = {
          containers: action.payload.containers,
          timestamp: action.payload.timestamp
        };
        if (action.payload.commandRequestTopic && action.payload.commandResponseTopic) {
          nextState.overviewData[action.payload.servername]["commandRequestTopic"] = action.payload.commandRequestTopic;
          nextState.overviewData[action.payload.servername]["commandResponseTopic"] = action.payload.commandResponseTopic;
        }
      });

    case ressourceActionTypes.COLLECTION_SUCCESS_RESSOURCE:
      addCommandTopicToContainers(action.payload.containers, action.payload);

      return produce(state, (nextState) => {
        nextState.statsData[action.payload.servername] = {
          containers: action.payload.containers,
        };
        if (action.payload.commandRequestTopic && action.payload.commandResponseTopic) {
          nextState.statsData[action.payload.servername]["commandRequestTopic"] = action.payload.commandRequestTopic;
          nextState.statsData[action.payload.servername]["commandResponseTopic"] = action.payload.commandResponseTopic;
        }
      });

    case containerActionTypes.CONTAINER_LOAD_START:
      return produce(state, (nextState) => {
        action.payload.forEach((containerId: any) => {
          nextState.loadingContainers.push(containerId);
        });
      });

    case containerActionTypes.CONTAINER_LOAD_FINISHED:
      return produce(state, (nextState) => {
        nextState.loadingContainers = nextState.loadingContainers.filter(
          (containerId: any) => !action.payload.includes(containerId)
        );
      });

    case containerActionTypes.SOCKET_CONNECTION_INIT:
      return produce(state, (nextState) => {
        nextState.socketConnection = new signalR.HubConnectionBuilder()
          .withUrl(SOCKET_SERVER_UPDATES_ENDPOINT, { accessTokenFactory: () => action.payload })
          .build();
      });

    case containerActionTypes.SOCKET_CONNECTION_OFF:
      return produce(state, (nextState) => {
        nextState.socketConnection = undefined;
      });

    default:
      return state;
  }
};

export default containerDataReducer;
