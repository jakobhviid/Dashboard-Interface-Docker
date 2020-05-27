import produce from "immer";
import { overviewActionTypes, ressourceActionTypes, containerActionTypes } from "./containerData.types";

const signalR = require("@microsoft/signalr");

const INITIAL_STATE = {
  socketConnection: new signalR.HubConnectionBuilder().withUrl("http://127.0.0.1:5000/updates").build(),
  overviewData: {},
  statsData: {},
  loadingContainers: [],
};

const addCommandTopicToContainers = (containers, payload) => {
  for (const container of containers) {
    if (payload.commandRequestTopic && payload.commandResponseTopic) {
      container["commandRequestTopic"] = payload.commandRequestTopic;
      container["commandResponseTopic"] = payload.commandResponseTopic;
    }
  }
};

const overviewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case overviewActionTypes.COLLECTION_SUCCESS_OVERVIEW:
      addCommandTopicToContainers(action.payload.containers, action.payload);
      return produce(state, (nextState) => {
        nextState.overviewData[action.payload.servername] = {
          containers: action.payload.containers,
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
        action.payload.forEach(containerId => {
          nextState.loadingContainers.push(containerId);
        });
      });

    case containerActionTypes.CONTAINER_LOAD_FINISHED:
      return produce(state, (nextState) => {
        nextState.loadingContainers = nextState.loadingContainers.filter((containerId) => !action.payload.includes(containerId));
      });

    default:
      return state;
  }
};

export default overviewReducer;
