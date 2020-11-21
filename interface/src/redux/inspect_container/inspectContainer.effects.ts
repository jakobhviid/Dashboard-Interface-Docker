import {HubConnection} from "@microsoft/signalr";
import {INSPECT_CONTAINER_FUNCTION} from "../../util/socketEvents";
import {IAPIInspectData} from "../../types/api_response/container.types";
import { inspectDataReceived } from "./inspectContainer.actions";
import {IInspectData} from "./inspectContainer.types";
import {Dispatch} from "redux";

export const startInspectDataListening = () => {
    return (dispatch: any, getState: any) => {
        const socketConnection: HubConnection = getState().containerData.socketConnection;
        socketConnection.on(INSPECT_CONTAINER_FUNCTION, (data: string) => {
            const apiInspectData: IAPIInspectData = JSON.parse(data);
            const inspectData: IInspectData = {
                serverName: apiInspectData.Servername,
                containerId: apiInspectData.ContainerId,
                rawData: apiInspectData.RawData
            }
            dispatch(inspectDataReceived(inspectData));
        });
    };
};

export const stopInspectDataOverview = () => {
    return (dispatch: Dispatch, getState: () => any) => {
        const socketConnection: HubConnection = getState().containerData.socketConnection;
        socketConnection.off(INSPECT_CONTAINER_FUNCTION);
    };
};