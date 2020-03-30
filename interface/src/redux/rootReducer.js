import { combineReducers } from "redux";

import overviewReducer from "./overview/overview.reducer";
import ressourceReducer from "./ressource/ressource.reducer";

const rootReducer = combineReducers({
  overview: overviewReducer,
  ressourceUsage: ressourceReducer
});

export default rootReducer;
