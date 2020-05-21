import { combineReducers } from "redux";

import containerReducer from "./container_data/containerData.reducer";
import notificationsReducer from "./notifier/notifier.reducer";
import monitoringEventsReducer from "./monitoring_events/monitoringEvents.reducer";
import uiReducer from "./ui/ui.reducer";

const rootReducer = combineReducers({
  containerData: containerReducer,
  notifications: notificationsReducer,
  monitoringEvents: monitoringEventsReducer,
  ui: uiReducer,
});

export default rootReducer;
