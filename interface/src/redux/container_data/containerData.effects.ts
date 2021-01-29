import moment from "moment";

import { enqueueSnackbar } from "../notifier/notifier.actions";

import {
  OVERVIEWDATA_FUNCTION,
  NEWEST_OVERVIEW_DATA_REQUEST,
  STATSDATA_FUNCTION,
  NEWEST_STATS_DATA_REQUEST,
  COMMAND_RESPONSES_FUNCTION,
} from "../../util/socketEvents";
import { calculateAppropiateByteType } from "../../util/helpers";
import { collectionSuccessOverview, ressourceCollectionSuccess, containerLoadFinished } from "./containerData.actions";
import { checkContainerOverviewData, checkContainerStats } from "../monitoring_events/monitoringEvents.actions";
import { Dispatch } from "redux";
import { IAPIOverviewData, IAPIStatsData } from "../../types/api_response/container.types";
import {HttpError, HubConnection} from "@microsoft/signalr";
import {startInspectDataListening} from "../inspect_container/inspectContainer.effects";
import {removeJwt} from "../user/user.actions";

export const dataCollectionStart = () => {
  return (dispatch: any, getState: any) => {
    const socketConnection: HubConnection = getState().containerData.socketConnection;
    socketConnection.start().then(() => {
      dispatch(startCollectingOverview());
      dispatch(startCollectingRessources());
      dispatch(startListeningForCommandResponses());
      dispatch(startInspectDataListening());
    }).catch((e: HttpError) => {
      if(e.statusCode == 401) {
        dispatch(removeJwt());
        dispatch(
            enqueueSnackbar({
              message: "Invalid or old login token, please login again",
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "error",
                persist: false,
              },
            })
        );
      }
    });
  };
};

export const startCollectingOverview = () => {
  return (dispatch: any, getState: any) => {
    const socketConnection: HubConnection = getState().containerData.socketConnection;
    socketConnection.on(OVERVIEWDATA_FUNCTION, (data: string) => {
      const overviewData: IAPIOverviewData = JSON.parse(data);

      dispatch(checkContainerOverviewData(overviewData.containers, overviewData.servername));
      for (const container of overviewData.containers) {
        const creationTimeDate = new Date(container["creationTime"]);
        container.creationTime = moment(creationTimeDate).locale("da").format("ll");
      }

      dispatch(collectionSuccessOverview(overviewData));
    });
    socketConnection.invoke(NEWEST_OVERVIEW_DATA_REQUEST);
  };
};

export const stopCollectingOverview = () => {
  return (dispatch: Dispatch, getState: () => any) => {
    const socketConnection: HubConnection = getState().containerData.socketConnection;
    socketConnection.off(OVERVIEWDATA_FUNCTION);
  };
};

export const startCollectingRessources = () => {
  return (dispatch: Dispatch, getState: () => any) => {
    const socketConnection: HubConnection = getState().containerData.socketConnection;

    socketConnection.on(STATSDATA_FUNCTION, (data: string) => {
      const statsData: IAPIStatsData = JSON.parse(data);
      if (statsData.containers == null) {
        throw new Error("Containers not present");
      }
      dispatch(checkContainerStats(statsData.containers, statsData.servername));
      for (const container of statsData.containers) {
        const netIO =
          calculateAppropiateByteType(container.netInputBytes) + " / " + calculateAppropiateByteType(container.netOutputBytes);
        const diskIO =
          calculateAppropiateByteType(container.diskInputBytes) + " / " + calculateAppropiateByteType(container.diskOutputBytes);
        container.netIO = netIO;
        container.diskIO = diskIO;
      }
      dispatch(ressourceCollectionSuccess(statsData));
    });
    socketConnection.invoke(NEWEST_STATS_DATA_REQUEST);
  };
};

export const stopCollectingRessources = () => {
  return (dispatch: Dispatch, getState: () => any) => {
    const socketConnection: HubConnection = getState().containerData.socketConnection;
    socketConnection.off(STATSDATA_FUNCTION);
  };
};

interface ICommandResponse {
  responseStatusCode: number;
  message: string;
  containerIds: string[];
}

export const startListeningForCommandResponses = () => {
  return (dispatch: Dispatch, getState: () => any) => {
    const socketConnection: HubConnection = getState().containerData.socketConnection;

    socketConnection.on(COMMAND_RESPONSES_FUNCTION, (response: string) => {
      const parsedResponse: ICommandResponse = JSON.parse(response);
      var succesful: boolean = parsedResponse.responseStatusCode.toString().startsWith("2");
      dispatch(
        enqueueSnackbar({
          message: parsedResponse.message,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: succesful ? "success" : "error",
            persist: false,
          },
        })
      );
      dispatch(containerLoadFinished(parsedResponse.containerIds));
    });
  };
};

export const stopListeningForCommandResponses = () => {
  return (dispatch: Dispatch, getState: () => any) => {
    const socketConnection: HubConnection = getState().containerData.socketConnection;
    socketConnection.off(COMMAND_RESPONSES_FUNCTION);
  };
};
