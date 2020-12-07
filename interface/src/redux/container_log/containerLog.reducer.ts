import produce from "immer";
import types from "./containerLog.types";
import {
  ILogDataState,
  ReducerAction,
} from "../../types/redux/reducerStates.types";

const INITIAL_STATE: ILogDataState = {
  logRawData: {},
};

export default (state = INITIAL_STATE, action: ReducerAction) => {
  switch (action.type) {
    case types.LOG_DATA_RECEIVED:
      return produce(state, (nextState) => {
        nextState.logRawData[action.payload.containerId] =
          action.payload.logRawData;
      });
    default:
      return state;
  }
};
