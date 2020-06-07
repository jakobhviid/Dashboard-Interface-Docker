import types from "./ui.types";
import produce from "immer";
import { ReducerAction, IUI } from "../../types/redux/reducerStates.types";

const INITIAL_STATE: IUI = {
  headerTitle: "Dashboard",
};

export default (state = INITIAL_STATE, action: ReducerAction) => {
  switch (action.type) {
    case types.CHANGE_HEADER_TITLE:
      return produce(state, (nextState) => {
        nextState.headerTitle = action.payload;
      });
    default:
      return state;
  }
};
