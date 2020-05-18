import produce from "immer";
import socketIOClient from "socket.io-client";

import {
  overviewActionTypes,
  ressourceActionTypes,
  containerActionTypes,
} from "./containerData.types";

const INITIAL_STATE = {
  ioClient: socketIOClient("http://127.0.0.1:5001"),
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
        if (
          action.payload.commandRequestTopic &&
          action.payload.commandResponseTopic
        ) {
          nextState.overviewData[action.payload.servername][
            "commandRequestTopic"
          ] = action.payload.commandRequestTopic;
          nextState.overviewData[action.payload.servername][
            "commandResponseTopic"
          ] = action.payload.commandResponseTopic;
        }
      });

    case ressourceActionTypes.COLLECTION_SUCCESS_RESSOURCE:
      addCommandTopicToContainers(action.payload.containers, action.payload);

      return produce(state, (nextState) => {
        nextState.statsData[action.payload.servername] = {
          containers: action.payload.containers,
        };
        if (
          action.payload.commandRequestTopic &&
          action.payload.commandResponseTopic
        ) {
          nextState.statsData[action.payload.servername][
            "commandRequestTopic"
          ] = action.payload.commandRequestTopic;
          nextState.statsData[action.payload.servername][
            "commandResponseTopic"
          ] = action.payload.commandResponseTopic;
        }
      });

    case containerActionTypes.RENAME_CONTAINER_SUCCESS:
      return produce(state, (nextState) => {
        const server = action.payload.server;
        const updatedContainer = action.payload.updatedContainer;

        for (const [index, container] of state.overviewData[server][
          "containers"
        ].entries()) {
          if (container.id === updatedContainer.id) {
            nextState.overviewData[server]["containers"][
              index
            ] = updatedContainer;
          }
        }
      });

    case containerActionTypes.START_OR_STOP_CONTAINER_SUCCESS:
      return produce(state, (nextState) => {
        const server = action.payload.server;
        const updatedContainer = action.payload.updatedContainer;

        updatedContainer.state = updatedContainer.state.includes(
          "exited"
        )
          ? "running"
          : "exited";

        updatedContainer.statis = updatedContainer.state.includes("exited")
            ? "Exited a few seconds ago"
            : "Up a few seconds";

        for (const [index, container] of state.overviewData[server][
          "containers"
        ].entries()) {
          if (container.id === updatedContainer.id) {
            nextState.overviewData[server]["containers"][
              index
            ] = updatedContainer;
          }
        }
      });

    case containerActionTypes.RESART_CONTAINER_SUCCESS:
      return produce(state, (nextState) => {
        const server = action.payload.server;
        const updatedContainer = action.payload.updatedContainer;

        for (const [index, container] of state.overviewData[server][
          "containers"
        ].entries()) {
          if (container.id === updatedContainer.id) {
            nextState.overviewData[server][index] = updatedContainer;
          }
        }
      });

    case containerActionTypes.REMOVE_CONTAINER_SUCCESS:
      return produce(state, (nextState) => {
        const server = action.payload.server;
        const removedContainer = action.payload.removedContainer;
        let indexOfContainer = null;
        for (const [index, container] of state.overviewData[server][
          "containers"
        ].entries()) {
          if (container.id === removedContainer.id) {
            indexOfContainer = index;
          }
        }
        if (indexOfContainer !== null) {
          nextState.overviewData[server]["containers"].splice(
            indexOfContainer,
            1
          );
        }
      });

    case containerActionTypes.CONTAINER_LOAD_START:
      return produce(state, (nextState) => {
        nextState.loadingContainers.push(action.payload);
      });

    case containerActionTypes.CONTAINER_LOAD_SUCCESS:
      return produce(state, (nextState) => {
        nextState.loadingContainers = nextState.loadingContainers.filter(
          (containerId) => containerId !== action.payload
        );
      });

    // TODO - handle this
    case containerActionTypes.CONTAINER_LOAD_FAIL:
      return produce(state, (nextState) => {
        nextState.loadingContainers = nextState.loadingContainers.filter(
          (containerId) => containerId !== action.payload
        );
      });
    default:
      return state;
  }
};

export default overviewReducer;
