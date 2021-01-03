export const monitorNotificationActionType = {
    NOTIFICATION_RECEIVED: "NOTIFICATION_RECEIVED",
    CLEAR_ALL_WARNINGS: "CLEAR_ALL_WARNINGS",
};

export const monitorNotificationReason = {
    UNHEALTHY: "Unhealthy Container",
    HEALTH_CHECK_FAIL: "Container Failed Healthcheck",
    HIGH_CPU_USAGE: "High CPU Usage",
    HIGH_MEMORY_USAGE: "High Memory Usage",
};

export const monitorNotificationType = {
    ERROR: "ERROR",
    WARNING: "WARNING",
    INFO: "INFORMATION",
};

export interface IMonitorNotification {
    serverName: string;
    containerId: string;
    containerName: string;
    timestamp: string;
    reason: string;
    type: string;
    extraInfo?: string;
}
