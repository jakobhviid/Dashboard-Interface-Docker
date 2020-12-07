import {HubConnection} from "@microsoft/signalr";
import {LOG_CONTAINER_FUNCTION} from "../../util/socketEvents";
import {IAPILogData} from "../../types/api_response/container.types";
import { logDataReceived } from "./containerLog.actions";
import {ILogData} from "../../types/redux/reducerStates.types";
import {Dispatch} from "redux";

export const startLogDataListening =  () => {
    throw new Error("Not Implemented - Start data Listen");
    
}

export const stopLogDataListening =  () => {
    throw new Error("Not Implemented - Stop data Listen");
    
}