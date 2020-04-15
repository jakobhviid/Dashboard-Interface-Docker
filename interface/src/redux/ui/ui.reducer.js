import types from "./ui.types";
import produce from "immer";

const INITIAL_STATE = {
  headerTitle: "Dashboard",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CHANGE_HEADER_TITLE:
      return produce(state, (nextState) => {
        nextState.headerTitle = action.payload;
      });
    default:
      return state;
  }
};
