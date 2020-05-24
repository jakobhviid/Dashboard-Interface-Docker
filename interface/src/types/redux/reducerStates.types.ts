import { HubConnection } from "@microsoft/signalr";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { Action } from "redux";

export interface IContainerData {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  creationTime: string;
  updateTime: Date;
  commandRequestTopic?: string;
  commandResponseTopic?: string;
}

export interface IContainerDataState {
  socketConnection: HubConnection;
  overviewData: {
    [key: string]: {
      containers: IContainerData[];
      commandRequestTopic?: string;
      commandResponseTopic?: string;
    };
  };
  statsData: any;
  loadingContainers: any;
}

export const useTypedSelector: TypedUseSelectorHook<IRootState> = useSelector;
export interface IRootState {
  containerData: IContainerDataState;
}

export interface ReducerAction extends Action {
  type: string;
  payload: any;
}
