import { combineReducers } from "redux";

import containerReducer from "./container_data/containerData.reducer";
import notificationsReducer from "./notifier/notifier.reducer";

const rootReducer = combineReducers({
  containerData: containerReducer,
  notifications: notificationsReducer,
});

export default rootReducer;
