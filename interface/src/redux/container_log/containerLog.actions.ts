import logActionType from "./containerLog.types";
import { ILogData } from "../../types/redux/reducerStates.types";

export const logDataReceived = (data: ILogData) => ({
  type: logActionType.LOG_DATA_RECEIVED,
  payload: data,
});
