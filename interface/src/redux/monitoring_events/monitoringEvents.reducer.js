import types from "./monitoringEvents.types";
import produce from "immer";

const INITIAL_STATE = {
  activeWarnings: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CONTAINER_WARNING_FOUND:
      return produce(state, (nextState) => {
        for (const containerWarning of action.payload) {
          nextState.activeWarnings.push(containerWarning);
        }
      });
    case types.CLEAR_ALL_WARNINGS:
      return produce(state, (nextState) => {
        nextState.activeWarnings = [];
      });
    default:
      return state;
  }
};
