import { HubConnection } from "@microsoft/signalr";
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { Action } from "redux";

export interface IContainerDataState {
  socketConnection: HubConnection
  overviewData: any,
  statsData: any,
  loadingContainers: any,
}

export const useTypedSelector: TypedUseSelectorHook<IRootState> = useSelector
export interface IRootState {
  containerData: IContainerDataState;
}

export interface ReducerAction extends Action {
  type: string,
  payload: any
}
