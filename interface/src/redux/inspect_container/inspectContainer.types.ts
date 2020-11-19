export const inspectActionType = {
    INSPECT_LISTEN_START: "INSPECT_LISTEN_START",
    INSPECT_DATA_RECEIVED: "INSPECT_DATA_RECEIVED"
};

export interface IListeningServerAndContainer {
    serverName: string,
    containerId: string
}

export interface IInspectData {
    serverName: string,
    containerId: string,
    rawData: string
}