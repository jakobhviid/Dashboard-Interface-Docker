import produce from "immer";
import { inspectActionType } from "./inspectContainer.types";
import { IInspectDataState, ReducerAction } from "../../types/redux/reducerStates.types";

const INITIAL_STATE: IInspectDataState = {
    inspectRawData: {}
};

const inspectContainerReducer = (state = INITIAL_STATE, action: ReducerAction) => {
    switch (action.type) {
        case inspectActionType.INSPECT_DATA_RECEIVED:
            return produce(state, (nextState) => {
                nextState.inspectRawData[action.payload.containerId] = action.payload.rawData
            });
        default:
            return state;
    }
};

export default inspectContainerReducer;