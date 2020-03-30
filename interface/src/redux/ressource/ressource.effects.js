import { ressourceCollectionSuccess } from "./ressource.actions";
import socketIOClient from "socket.io-client";
import { calculateAppropiateByteType } from "../../util/helpers";

import {
  RESSOURCE_USAGE_ENDPOINT,
  NEWEST_STATS_DATA_REQUEST
} from "../../util/socketEvents";

export const startCollectingRessources = () => {
  return dispatch => {
    const ioClient = socketIOClient("http://127.0.0.1:5000");
    ioClient.emit(NEWEST_STATS_DATA_REQUEST);
    ioClient.on(RESSOURCE_USAGE_ENDPOINT, data => {
      for (const container of data.containers) {
        const net_i_o =
          calculateAppropiateByteType(container.net_input_bytes) +
          " / " +
          calculateAppropiateByteType(container.net_output_bytes);
        const disk_i_o =
          calculateAppropiateByteType(container.disk_input_bytes) +
          " / " +
          calculateAppropiateByteType(container.disk_output_bytes);
        container["net_i_o"] = net_i_o;
        container["disk_i_o"] = disk_i_o;
      }
      dispatch(ressourceCollectionSuccess(data));
    });
  };
};
