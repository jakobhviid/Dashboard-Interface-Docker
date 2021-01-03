import {IMonitorNotification, monitorNotificationActionType} from "./monitorNotification.types";

export const notificationReceived = (data: IMonitorNotification) => ({
    type: monitorNotificationActionType.NOTIFICATION_RECEIVED,
    payload: data,
});

export const clearAllWarnings = () => ({
    type: monitorNotificationActionType.CLEAR_ALL_WARNINGS,
});
