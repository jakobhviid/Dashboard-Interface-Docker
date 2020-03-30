import produce from "immer";

import overviewActionTypes from "./overview.types";

const INITIAL_STATE = {
  collectedData: {}
};

const overviewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case overviewActionTypes.COLLECTION_SUCCESS_OVERVIEW:
      const servername = action.payload.servername;
      const containers = action.payload.containers;
      return produce(state, nextState => {
        nextState.collectedData[servername] = containers;
      });
    default:
      return state;
  }
};

export default overviewReducer;
