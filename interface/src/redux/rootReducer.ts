import { combineReducers } from "redux";

import containerReducer from "./container_data/containerData.reducer";
import notificationsReducer from "./notifier/notifier.reducer";
import monitoringEventsReducer from "./monitoring_events/monitoringEvents.reducer";
import uiReducer from "./ui/ui.reducer";
import userReducer from "./user/user.reducer";
import inspectContainerReducer from "./inspect_container/inspectContainer.reducer";
import logContainerReducer from "./container_log/containerLog.reducer";

const rootReducer = combineReducers({
  containerData: containerReducer,
  notifications: notificationsReducer,
  monitoringEvents: monitoringEventsReducer,
  ui: uiReducer,
  user: userReducer,
  inspectData: inspectContainerReducer,
  logData: logContainerReducer,
});

export default rootReducer;
