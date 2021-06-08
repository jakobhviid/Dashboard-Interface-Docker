import {HubConnection} from "@microsoft/signalr";
import {MONITOR_NOTIFICATION_FUNCTION} from "../../util/socketEvents";
import {Dispatch} from "redux";
import {IAPIMonitorNotification} from "../../types/api_response/monitor.types";
import {IMonitorNotification} from "./monitorNotification.types";
import {notificationReceived} from "./monitorNotification.actions";

export const startMonitorNotificationListening = () => {
    return (dispatch: any, getState: any) => {
        const socketConnection: HubConnection = getState().containerData.socketConnection;
        socketConnection.on(MONITOR_NOTIFICATION_FUNCTION, (data: string) => {
            const apiNotification: IAPIMonitorNotification = JSON.parse(data);
            console.log(apiNotification);
            const notification: IMonitorNotification = {
                serverName: apiNotification.ServerName,
                containerId: apiNotification.ContainerId,
                containerName: apiNotification.ContainerName,
                timestamp: apiNotification.Timestamp,
                reason: apiNotification.Reason.toString(),
                type: apiNotification.Type.toString(),
                extraInfo: apiNotification.ExtraInfo
            }
            dispatch(notificationReceived(notification));
        });
    };
};

export const stopMonitorNotificationListening = () => {
    return (dispatch: Dispatch, getState: () => any) => {
        const socketConnection: HubConnection = getState().containerData.socketConnection;
        socketConnection.off(MONITOR_NOTIFICATION_FUNCTION);
    };
};
