import { inspectActionType, IInspectData } from "./inspectContainer.types";

export const inspectDataReceived = (data: IInspectData) => ({
    type: inspectActionType.INSPECT_DATA_RECEIVED,
    payload: data,
});
