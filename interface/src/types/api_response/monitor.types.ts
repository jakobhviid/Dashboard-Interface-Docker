// Corresponds to the API object that is emitted from the SocketServer
export enum IAPINotificationReason {
    UNHEALTHY,
    HEALTH_CHECK_FAIL,
    HIGH_CPU_USAGE,
    HIGH_MEMORY_USAGE
}

export enum IAPINotificationType {
    WARNING,
    ERROR,
    INFO
}

export interface IAPIMonitorNotification {
    ServerName: string;
    ContainerId: string;
    ContainerName: string;
    Timestamp: string;
    Reason: IAPINotificationReason;
    Type: IAPINotificationType;
    ExtraInfo?: string;
}
