import produce from "immer";
import { inspectActionType } from "./inspectContainer.types";
import { IInspectDataState, ReducerAction } from "../../types/redux/reducerStates.types";

const INITIAL_STATE: IInspectDataState = {
    listeningContainers: {},
    inspectRawData: {}
};

const inspectContainerReducer = (state = INITIAL_STATE, action: ReducerAction) => {
    console.log(action);
    switch (action.type) {
        // case inspectActionType.INSPECT_LISTEN_START:
        //     return produce(state, (nextState) => {
        //         nextState.listeningContainers[action.payload.serverName].push(action.payload.containerId)
        //
        //     });
        case inspectActionType.INSPECT_DATA_RECEIVED:
            return produce(state, (nextState) => {
                // var index = nextState.listeningContainers[action.payload.serverName].indexOf(action.payload.containerId);
                // nextState.listeningContainers[action.payload.serverName].splice(index, 1);
                nextState.inspectRawData[action.payload.containerId] = action.payload.rawData
            });
        default:
            return state;
    }
};

export default inspectContainerReducer;