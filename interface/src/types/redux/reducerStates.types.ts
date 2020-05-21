import { HubConnection } from "@microsoft/signalr";
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { Action } from "redux";

export interface IContainerDataState {
  socketConnection: HubConnection
  overviewData: {},
  statsData: {},
  loadingContainers: [],
}

export const useTypedSelector: TypedUseSelectorHook<IRootState> = useSelector
export interface IRootState {
  containerData: IContainerDataState;
}

export interface ReducerAction extends Action {
  type: string,
  payload: any
}
