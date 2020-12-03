export const inspectActionType = {
    INSPECT_DATA_RECEIVED: "INSPECT_DATA_RECEIVED"
};

export interface IInspectData {
    serverName: string,
    containerId: string,
    rawData: string
}