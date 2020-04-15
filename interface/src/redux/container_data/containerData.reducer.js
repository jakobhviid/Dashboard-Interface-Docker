import produce from "immer";
import moment from "moment";
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

const overviewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case overviewActionTypes.COLLECTION_SUCCESS_OVERVIEW:
      for (const container of action.payload.containers) {
        if (action.payload.actionURL) {
          container["actionURL"] = action.payload.actionURL;
        }
        // Visual representation of "Up 3 hours and exited 5 hours ago etc."
        const containerStatus = container.state.status;
        const containerStartTime = container.state.startTime;
        const timeSinceStart = moment(containerStartTime).fromNow();
        const containerFinishTime = container.state.finishTime;
        if (containerStatus === "running") {
          let stringRepresentation =
            "Up " +
            timeSinceStart.substring(0, timeSinceStart.lastIndexOf(" "));
          if (container.state.health) {
            stringRepresentation =
              stringRepresentation + " (" + container.state.health.status + ")";
          }
          container.state.stringRepresentation = stringRepresentation;
        } else {
          container.state.stringRepresentation =
            "Exited " + moment(containerFinishTime).fromNow();
        }
      }
      return produce(state, (nextState) => {
        nextState.overviewData[action.payload.servername] = {
          containers: action.payload.containers,
        };
        if (action.payload.actionURL) {
          nextState.overviewData[action.payload.servername]["actionURL"] =
            action.payload.actionURL;
        }
      });

    case ressourceActionTypes.COLLECTION_SUCCESS_RESSOURCE:
      for (const container of action.payload.containers) {
        if (action.payload.actionURL) {
          container["actionURL"] = action.payload.actionURL;
        }
      }

      return produce(state, (nextState) => {
        nextState.statsData[action.payload.servername] = {
          containers: action.payload.containers,
        };
        if (action.payload.actionURL) {
          nextState.statsData[action.payload.servername]["actionURL"] =
            action.payload.actionURL;
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

        updatedContainer.state.status =
          updatedContainer.state.status === "exited" ? "running" : "exited";

        updatedContainer.state.stringRepresentation =
          updatedContainer.state.status === "exited"
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
