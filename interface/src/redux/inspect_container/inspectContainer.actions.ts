import { inspectActionType, IListeningServerAndContainer, IInspectData } from "./inspectContainer.types";

export const inspectListenStart = (listeningServerAndContainer: IListeningServerAndContainer) => ({
    type: inspectActionType.INSPECT_LISTEN_START,
    payload: listeningServerAndContainer,
});

export const inspectDataReceived = (data: IInspectData) => ({
    type: inspectActionType.INSPECT_DATA_RECEIVED,
    payload: data,
});
