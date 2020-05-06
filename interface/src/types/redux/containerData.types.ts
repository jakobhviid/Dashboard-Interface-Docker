import { IAPIOverviewData } from "../api_response/container.types";
import { Action } from "redux";

interface ICollectionSuccessOverview extends Action {
  type: string;
  payload: IAPIOverviewData;
}

export type ContainerDataTypes = ICollectionSuccessOverview;
