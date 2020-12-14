import { HubConnection } from "@microsoft/signalr";
import { LOG_CONTAINER_FUNCTION } from "../../util/socketEvents";
import { IAPILogData } from "../../types/api_response/container.types";
import { logDataReceived } from "./containerLog.actions";
import { ILogData } from "../../types/redux/reducerStates.types";
import { Dispatch } from "redux";

export const startLogDataListening = () => {
  return (dispatch: any, getState: any) => {
    const socketConnection: HubConnection = getState().containerData
      .socketConnection;
    socketConnection.on(LOG_CONTAINER_FUNCTION, (data: string) => {
      const apiLogData: IAPILogData = JSON.parse(data);
      const logData: ILogData = {
        servName: apiLogData.servName,
        servID: apiLogData.servID,
        logData: apiLogData.logData,
      };
      dispatch(logDataReceived(logData));
    });
  };
};

export const stopLogDataOverview = () => {
  return (dispatch: Dispatch, getState: () => any) => {
    const socketConnection: HubConnection = getState().containerData
      .socketConnection;
    socketConnection.off(LOG_CONTAINER_FUNCTION);
  };
};
