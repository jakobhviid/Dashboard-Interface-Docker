import produce from "immer";
import { IMonitoringEvents, ReducerAction } from "../../types/redux/reducerStates.types";
import {monitorNotificationActionType} from "./monitorNotification.types";

const INITIAL_STATE: IMonitoringEvents = {
    activeWarnings: [],
};

export default (state = INITIAL_STATE, action: ReducerAction) => {
    switch (action.type) {
        case monitorNotificationActionType.NOTIFICATION_RECEIVED:
            return produce(state, (nextState) => {
                nextState.activeWarnings.push(action.payload);
            });
        case monitorNotificationActionType.CLEAR_ALL_WARNINGS:
            return produce(state, (nextState) => {
                nextState.activeWarnings = [];
            });
        default:
            return state;
    }
};
