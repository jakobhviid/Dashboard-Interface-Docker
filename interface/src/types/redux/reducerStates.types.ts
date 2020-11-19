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
  socketConnection: HubConnection | undefined;
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

export interface IMonitoringEvents {
  activeWarnings: any[];
}

export interface INotifier {
  activeNotifications: any[];
}

export interface IUI {
  headerTitle: string;
}

export interface IUserState {
  jwt?: string;
  displayName: string;
}

export interface IInspectDataState {
  listeningContainers: {
    [key: string]: string[] // Key is servername, "value" is containerId
  };
  inspectRawData: {
    [key: string]: string // Key is containerId, "value" is inspect raw data
  };
}

export interface IRootState {
  containerData: IContainerDataState;
  notifications: INotifier;
  monitoringEvents: IMonitoringEvents;
  ui: IUI;
  user: IUserState;
  inspectData: IInspectDataState;
}
export const useTypedSelector: TypedUseSelectorHook<IRootState> = useSelector;

export interface ReducerAction extends Action {
  type: string;
  payload: any;
}
