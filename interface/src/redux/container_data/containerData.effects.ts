import moment from "moment";

import { enqueueSnackbar } from "../notifier/notifier.actions";

import {
  OVERVIEWDATA_FUNCTION,
  NEWEST_OVERVIEW_DATA_REQUEST,
  STATSDATA_FUNCTION,
  NEWEST_STATS_DATA_REQUEST,
} from "../../util/socketEvents";
import { calculateAppropiateByteType } from "../../util/helpers";
import {
  collectionSuccessOverview,
  ressourceCollectionSuccess,
  renameContainerSuccess,
  startOrStopContainerSuccess,
  restartContainerSuccess,
  removeContainerSuccess,
  containerLoadStart,
  containerLoadFail,
  containerLoadSuccess,
} from "./containerData.actions";
import { checkContainerOverviewData, checkContainerStats } from "../monitoring_events/monitoringEvents.actions";
import { Dispatch } from "redux";
import { IAPIOverviewData, IAPIStatsData, IStatsContainer } from "../../types/api_response/container.types";
import { HubConnection } from "@microsoft/signalr";
import { ThunkAction } from "redux-thunk";
import { ReducerAction, IRootState } from "../../types/redux/reducerStates.types";
import { changeHeaderTitle } from "../ui/ui.actions";

const FETCH_TIMEOUT = 15000; // 15 seconds

async function actionRequest(url: string, postData: any, dispatch: Dispatch, containerId?: string) {
  dispatch(containerLoadStart(containerId));
  const params = {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(postData),
    method: "POST",
  };
  let response: any;
  try {
    let didTimeOut = false;
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        didTimeOut = true;
        reject(new Error("Request timed out"));
      }, FETCH_TIMEOUT);
      fetch(url, params).then((res) => {
        clearTimeout(timeout);
        if (!didTimeOut) {
          response = res;
          resolve(response);
        }
      });
    });
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: "Container " + containerId + " - " + error.message,
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "error",
          persist: false,
        },
      })
    );
    dispatch(containerLoadFail(containerId));
    return;
  }
  const statusCode = response.status;
  response = await response.json();

  if (statusCode === 200) {
    dispatch(
      enqueueSnackbar({
        message: response.message,
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "success",
          persist: false,
        },
      })
    );
    dispatch(containerLoadSuccess(containerId));
  } else {
    dispatch(
      enqueueSnackbar({
        message: response.message,
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "error",
          persist: false,
        },
      })
    );
    dispatch(containerLoadFail(containerId));
    throw "Error";
  }
}

export const renameContainer = (server: string, container: any, newName: string) => {
  return (dispatch: Dispatch) => {
    const postData = {
      containerId: container.id,
      name: newName,
    };

    actionRequest(container.actionURL + "/rename-container", postData, dispatch, container.id).then(() => {
      container.name = newName;
      dispatch(renameContainerSuccess(container, server));
    });
  };
};

export const startOrStopContainer = (server: string, container: any) => {
  return (dispatch: Dispatch) => {
    const postData = {
      containerId: container.id,
    };
    if (container.state.status.toLowerCase() === "running") {
      actionRequest(container.actionURL + "/stop-container", postData, dispatch, container.id).then(() => {
        dispatch(startOrStopContainerSuccess(container, server));
      });
    } else {
      actionRequest(container.actionURL + "/start-container", postData, dispatch, container.id).then(() => {
        dispatch(startOrStopContainerSuccess(container, server));
      });
    }
  };
};

export const restartContainer = (server: string, container: any) => {
  return (dispatch: Dispatch) => {
    const postData = {
      containerId: container.id,
    };

    actionRequest(container.actionURL + "/restart-container", postData, dispatch, container.id).then(() => {
      container.state.stringRepresentation = "Restarted";
      dispatch(restartContainerSuccess(container, server));
    });
  };
};

export const removeContainer = (server: string, container: any) => {
  return (dispatch: Dispatch) => {
    const postData = {
      containerId: container.id,
    };

    actionRequest(container.actionURL + "/remove-container", postData, dispatch, container.id).then(() => {
      dispatch(removeContainerSuccess(container, server));
    });
  };
};

export const reconfigureContainer = (container: any, configureParams: any) => {
  return (dispatch: Dispatch) => {
    const postData = {
      containerId: container.id,
      ...configureParams,
    };
    actionRequest(container.actionURL + "/update-container-configuration", postData, dispatch, container.id);
  };
};

export const runContainer = (serverActionURL: any, runParams: any) => {
  return (dispatch: Dispatch) => {
    const postData = {
      ...runParams,
    };
    actionRequest(serverActionURL + "/run-container", postData, dispatch);
  };
};

export const startCollectingOverview = () => {
  return (dispatch: any, getState: any) => {
    const socketConnection: HubConnection = getState().containerData.socketConnection;
    socketConnection.on(OVERVIEWDATA_FUNCTION, (data: string) => {
      const overviewData: IAPIOverviewData = JSON.parse(data);
      if (overviewData.containers == null) {
        throw new Error("Containers not present");
      }

      console.log(overviewData.containers, "WUHU");
      dispatch(changeHeaderTitle("Container Overview2222"));
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
