import { collectionSuccessOverview } from "./overview.actions";
import socketIOClient from "socket.io-client";

import {
  GENERAL_SOCKET_ENDPOINT,
  NEWEST_OVERVIEW_DATA_REQUEST
} from "../../util/socketEvents";

export const startCollectingOverview = () => {
  return dispatch => {
    const ioClient = socketIOClient("http://127.0.0.1:5000");
    ioClient.emit(NEWEST_OVERVIEW_DATA_REQUEST);
    ioClient.on(GENERAL_SOCKET_ENDPOINT, data => {
      const containers = data.containers;
      for (const container of containers) {
        const creationTimeDate = new Date(container["creation_time"]);
        const options = {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        };
        container["creation_time"] = creationTimeDate.toLocaleTimeString(
          "en-us",
          options
        );
      }
      dispatch(collectionSuccessOverview(data));
    });
  };
};
