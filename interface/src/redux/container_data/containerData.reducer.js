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
};

const overviewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case overviewActionTypes.COLLECTION_SUCCESS_OVERVIEW:
      for (const container of action.payload.containers) {
        // TODO - Make this an attribute on the server
        container["actionURL"] = "http://127.0.0.1:5000";
        container["update_time"] = new Date();

        // Visual representation of "Up 3 hours and exited 5 hours ago etc."
        const containerStatus = container.state.status;
        const containerStartTime = container.state.startTime;
        const timeSinceStart = moment(containerStartTime).fromNow();
        const containerFinishTime = container.state.finishTime;
        container.state.stringRepresentation =
          containerStatus === "running"
            ? "Up " +
              timeSinceStart.substring(0, timeSinceStart.lastIndexOf(" "))
            : "Exited " + moment(containerFinishTime).fromNow();
      }
      return produce(state, (nextState) => {
        nextState.overviewData[action.payload.servername] =
          action.payload.containers;
      });

    case ressourceActionTypes.COLLECTION_SUCCESS_RESSOURCE:
      // TODO - Make this an attribute on the server
      for (const container of action.payload.containers) {
        container["actionURL"] = "http://127.0.0.1:5000";
        container["update_time"] = new Date();
      }

      return produce(state, (nextState) => {
        nextState.statsData[action.payload.servername] =
          action.payload.containers;
      });

    case containerActionTypes.RENAME_CONTAINER_SUCCESS:
      return produce(state, (nextState) => {
        const server = action.payload.server;
        const updatedContainer = action.payload.updatedContainer;

        for (const [index, container] of state.overviewData[server].entries()) {
          if (container.id === updatedContainer.id) {
            nextState.overviewData[server][index] = updatedContainer;
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

        for (const [index, container] of state.overviewData[server].entries()) {
          if (container.id === updatedContainer.id) {
            nextState.overviewData[server][index] = updatedContainer;
          }
        }
      });

    case containerActionTypes.RESART_CONTAINER_SUCCESS:
      return produce(state, (nextState) => {
        const server = action.payload.server;
        const updatedContainer = action.payload.updatedContainer;

        for (const [index, container] of state.overviewData[server].entries()) {
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
        for (const [index, container] of state.overviewData[server].entries()) {
          if (container.id === removedContainer.id) {
            indexOfContainer = index;
          }
        }
        if (indexOfContainer !== null) {
          nextState.overviewData[server].splice(indexOfContainer, 1);
        }
      });
    default:
      return state;
  }
};

export default overviewReducer;
