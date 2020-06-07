import types from "./monitoringEvents.types";
import produce from "immer";
import { IMonitoringEvents, ReducerAction } from "../../types/redux/reducerStates.types";

const INITIAL_STATE: IMonitoringEvents = {
  activeWarnings: [],
};

export default (state = INITIAL_STATE, action: ReducerAction) => {
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
