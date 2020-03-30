import produce from "immer";

import ressourceActionTypes from "./ressource.types";

const INITIAL_STATE = {
  collectedData: {}
};

const ressourceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ressourceActionTypes.COLLECTION_SUCCESS_RESSOURCE:
      const servername = action.payload.servername;
      const containers = action.payload.containers;
      return produce(state, nextState => {
        nextState.collectedData[servername] = containers;
      });
    default:
      return state;
  }
};

export default ressourceReducer;
