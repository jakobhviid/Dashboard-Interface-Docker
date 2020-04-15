import moment from "moment";

import { enqueueSnackbar } from "../notifier/notifier.actions";

import {
  GENERAL_SOCKET_ENDPOINT,
  NEWEST_OVERVIEW_DATA_REQUEST,
  RESSOURCE_USAGE_ENDPOINT,
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
import {
  checkContainerOverviewData,
  checkContainerStats,
} from "../monitoring_events/monitoringEvents.actions";

const FETCH_TIMEOUT = 15000; // 15 seconds

async function actionRequest(url, postData, dispatch, containerId) {
  dispatch(containerLoadStart(containerId));
  const params = {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(postData),
    method: "POST",
  };
  let response;
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

export const renameContainer = (server, container, newName) => {
  return (dispatch) => {
    const postData = {
      container_id: container.id,
      name: newName,
    };

    actionRequest(
      container.actionURL + "/rename-container",
      postData,
      dispatch,
      container.id
    ).then(() => {
      container.name = newName;
      dispatch(renameContainerSuccess(container, server));
    });
  };
};

export const startOrStopContainer = (server, container) => {
  return (dispatch) => {
    const postData = {
      container_id: container.id,
    };
    if (container.state.status.toLowerCase() === "running") {
      actionRequest(
        container.actionURL + "/stop-container",
        postData,
        dispatch,
        container.id
      ).then(() => {
        dispatch(startOrStopContainerSuccess(container, server));
      });
    } else {
      actionRequest(
        container.actionURL + "/start-container",
        postData,
        dispatch,
        container.id
      ).then(() => {
        dispatch(startOrStopContainerSuccess(container, server));
      });
    }
  };
};

export const restartContainer = (server, container) => {
  return (dispatch) => {
    const postData = {
      container_id: container.id,
    };

    actionRequest(
      container.actionURL + "/restart-container",
      postData,
      dispatch,
      container.id
    ).then(() => {
      container.state.stringRepresentation = "Restarted";
      dispatch(restartContainerSuccess(container, server));
    });
  };
};

export const removeContainer = (server, container) => {
  return (dispatch) => {
    const postData = {
      container_id: container.id,
    };

    actionRequest(
      container.actionURL + "/remove-container",
      postData,
      dispatch,
      container.id
    ).then(() => {
      dispatch(removeContainerSuccess(container, server));
    });
  };
};

export const reconfigureContainer = (container, configureParams) => {
  return (dispatch) => {
    const postData = {
      container_id: container.id,
      ...configureParams,
    };
    actionRequest(
      container.actionURL + "/update-container-configuration",
      postData,
      dispatch,
      container.id
    );
  };
};

export const runContainer = (serverActionURL, runParams) => {
  return (dispatch) => {
    const postData = {
      ...runParams,
    };
    actionRequest(serverActionURL + "/run-container", postData, dispatch);
  };
};

export const startCollectingOverview = () => {
  return (dispatch, getState) => {
    const ioClient = getState().containerData.ioClient;

    ioClient.on(GENERAL_SOCKET_ENDPOINT, (data) => {
      const containers = data.containers;

      dispatch(checkContainerOverviewData(containers, data.servername));

      for (const container of containers) {
        const creationTimeDate = new Date(container["creation_time"]);
        container["creation_time"] = moment(creationTimeDate)
          .locale("da")
          .format("ll");
      }
      dispatch(collectionSuccessOverview(data));
    });

    ioClient.emit(NEWEST_OVERVIEW_DATA_REQUEST);
  };
};

export const stopCollectingOverview = () => {
  return (dispatch, getState) => {
    const ioClient = getState().containerData.ioClient;
    ioClient.off(GENERAL_SOCKET_ENDPOINT);
  };
};

export const startCollectingRessources = () => {
  return (dispatch, getState) => {
    const ioClient = getState().containerData.ioClient;
    ioClient.on(RESSOURCE_USAGE_ENDPOINT, (data) => {
      dispatch(checkContainerStats(data.containers, data.servername));
      for (const container of data.containers) {
        const net_i_o =
          calculateAppropiateByteType(container.net_input_bytes) +
          " / " +
          calculateAppropiateByteType(container.net_output_bytes);
        const disk_i_o =
          calculateAppropiateByteType(container.disk_input_bytes) +
          " / " +
          calculateAppropiateByteType(container.disk_output_bytes);
        container["net_i_o"] = net_i_o;
        container["disk_i_o"] = disk_i_o;
      }
      dispatch(ressourceCollectionSuccess(data));
    });
    ioClient.emit(NEWEST_STATS_DATA_REQUEST);
  };
};

export const stopCollectingRessources = () => {
  return (dispatch, getState) => {
    const ioClient = getState().containerData.ioClient;
    ioClient.off(RESSOURCE_USAGE_ENDPOINT);
  };
};
