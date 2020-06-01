import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HubConnection } from "@microsoft/signalr";

import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import ContainerTable from "../../components/container_table/ContainerTable.component";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import {
  RENAME_CONTAINER_REQUEST,
  STOP_CONTAINER_REQUEST,
  START_CONTAINER_REQUEST,
  RESTART_CONTAINER_REQUEST,
  REMOVE_CONTAINER_REQUEST,
  CREATE_NEW_CONTAINER_REQUEST,
  REFETCH_OVERVIEW_DATA,
} from "../../util/socketEvents";

import { changeHeaderTitle } from "../../redux/ui/ui.actions";
import { containerLoadStart } from "../../redux/container_data/containerData.actions";
import RenameContainerDialog from "../../components/dialogs/rename_dialog/RenameContainerDialog.component";
import NewContainerDialog from "../../components/dialogs/newcontainer_dialog/NewContainerDialog.component";

import useStyles from "./Overview.styles";
import { IRootState } from "../../types/redux/reducerStates.types";

const columnsServerView = [
  { title: "Name", alignment: "left", field: "name" },
  { title: "Id", alignment: "left", field: "id" },
  { title: "Image", alignment: "left", field: "image" },
  {
    title: "Status",
    alignment: "left",
    field: "status",
  },
  {
    title: "Creation Time",
    alignment: "left",
    field: "creationTime",
  },
];

const columnsContainerView = [
  ...columnsServerView,
  {
    title: "Server",
    alignment: "left",
    field: "servername",
  },
];

interface IContainerState {
  id: string;
  name: string;
  image: string[];
  state: string;
  status: string;
  creationTime: Date | string;
  updateTime: Date | string;
  commandRequestTopic?: string;
  commandResponseTopic?: string;
}

function Overview() {
  const [serverMode, setServerMode] = React.useState(true);
  const [selectedContainer, setSelectedContainer] = React.useState<IContainerState | null>(null);
  const [createContainerDialogOpen, setCreateContainerDialogOpen] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const dispatch = useDispatch();
  const overviewData = useSelector((store: IRootState) => store.containerData.overviewData);
  const socketConnection: HubConnection = useSelector((store: IRootState) => store.containerData.socketConnection);
  const classes = useStyles();

  React.useEffect(() => {
    dispatch(changeHeaderTitle("Container Overview"));
  }, []);

  const handleRename = (newName: string) => {
    if (selectedContainer != null) {
      dispatch(containerLoadStart([selectedContainer.id]));
      socketConnection.invoke(RENAME_CONTAINER_REQUEST, selectedContainer.commandRequestTopic, selectedContainer.id, newName);
    }
  };

  const actions = [
    {
      label: "Rename",
      onClick: (selectedContainer: IContainerState) => {
        setSelectedContainer(selectedContainer);
        setRenameDialogOpen(true);
      },
    },
    {
      label: "Start/Stop",
      onClick: (selectedContainer: IContainerState) => {
        if (selectedContainer.commandRequestTopic != null)
          if (selectedContainer.state.includes("running")) {
            dispatch(containerLoadStart([selectedContainer.id]));
            socketConnection.invoke(STOP_CONTAINER_REQUEST, selectedContainer.commandRequestTopic, selectedContainer.id);
          } else socketConnection.invoke(START_CONTAINER_REQUEST, selectedContainer.commandRequestTopic, selectedContainer.id);
      },
    },
    {
      label: "Restart",
      onClick: (selectedContainer: IContainerState) => {
        dispatch(containerLoadStart([selectedContainer.id]));
        socketConnection.invoke(RESTART_CONTAINER_REQUEST, selectedContainer.commandRequestTopic, selectedContainer.id);
      },
    },
    {
      label: "Remove",
      onClick: (selectedContainer: IContainerState) => {
        dispatch(containerLoadStart([selectedContainer.id]));
        socketConnection.invoke(REMOVE_CONTAINER_REQUEST, selectedContainer.commandRequestTopic, selectedContainer.id, true); //TODO: Ask user if they want to remove volumes aswell
      },
    },
  ];

  const refetchContainers = (servers: string[]) => {
    if (!serverMode) {
      for (const servername of Object.keys(overviewData)) {
        dispatch(containerLoadStart(overviewData[servername].containers.map((container) => container.id)));
        if (overviewData[servername].commandRequestTopic)
          socketConnection.invoke(REFETCH_OVERVIEW_DATA, overviewData[servername].commandRequestTopic);
      }
    } else {
      servers.forEach((servername) => {
        const containerIds = overviewData[servername].containers.map((container) => container.id);
        dispatch(containerLoadStart(containerIds));
        if (overviewData[servername].commandRequestTopic)
          socketConnection.invoke(REFETCH_OVERVIEW_DATA, overviewData[servername].commandRequestTopic);
      });
    }
  };

  let containerView: any = null;

  if (Object.keys(overviewData).length !== 0) {
    if (!serverMode) {
      containerView = [];
      for (const server of Object.keys(overviewData)) {
        for (const container of overviewData[server].containers) {
          // JSON parse and stringify to create mutable object
          containerView.push({
            ...JSON.parse(JSON.stringify(container)),
            server,
          });
        }
      }
    } else {
      containerView = JSON.parse(JSON.stringify(overviewData));
    }
  }

  function createNewContainer(values: any) {
    const objectToSend: any = {};

    if (values["image"] !== "") objectToSend["image"] = values["image"];
    if (values["name"] !== "") objectToSend["name"] = values["name"];
    if (values["command"] !== "") objectToSend["command"] = values["command"];

    if (values["restart_policy"]["name"] !== "{}") {
      const restartPolicyObject: any = { Name: values["restart_policy"]["name"] };
      if (values["restart_policy"]["maximumRetryCount"] !== "")
        restartPolicyObject["MaximumRetryCount"] = parseInt(values["restart_policy"]["maximumRetryCount"]);
      objectToSend["restart_policy"] = restartPolicyObject;
    }

    const ports: any = {};
    for (const port of values["ports"]) {
      ports[port.portContainer + "/tcp"] = port.portHost;
    }
    if (Object.keys(ports).length !== 0) objectToSend["ports"] = ports;

    const environmentVariables = [];
    for (const environment of values["environment"]) {
      environmentVariables.push(environment.key + "=" + environment.value);
    }
    if (environmentVariables.length !== 0) objectToSend["environment"] = environmentVariables;

    const volumes: any = {};
    for (const volume of values["volumes"]) {
      volumes[volume.hostPath] = { bind: volume.bind, mode: volume.mode };
    }
    if (Object.keys(volumes).length !== 0) objectToSend["volumes"] = volumes;

    socketConnection.invoke(CREATE_NEW_CONTAINER_REQUEST, values.server); // TODO: Give parameters once server supports it
  }

  return Object.keys(overviewData).length === 0 ? (
    <div style={{ textAlign: "center" }}>
      <CircularProgress color="secondary" />
    </div>
  ) : (
    <React.Fragment>
      <div style={{ textAlign: "right" }}>
        <Switch
          checked={serverMode}
          onChange={() => setServerMode(!serverMode)}
          name="Server Mode"
          inputProps={{ "aria-label": "server mode checkbox" }}
        />
      </div>
      {serverMode ? (
        Object.keys(containerView).map((servername) => {
          return (
            <div style={{ marginBottom: "18px" }} key={servername}>
              <ContainerTable
                title={servername}
                columns={columnsServerView}
                data={containerView[servername].containers}
                dense="small"
                actions={actions}
                onRefetch={() => refetchContainers([servername])}
              />
            </div>
          );
        })
      ) : (
        <ContainerTable
          title="All Containers"
          columns={columnsContainerView}
          data={containerView}
          dense="small"
          actions={actions}
          onRefetch={refetchContainers}
        />
      )}

      <Fab
        color="secondary"
        aria-label="Run Container"
        style={{ position: "absolute", textAlign: "right" }}
        variant="extended"
        size="large"
        className={classes.fab}
        onClick={() => setCreateContainerDialogOpen(true)}
      >
        <AddIcon className={classes.fabIcon} />
        Run Container
      </Fab>

      <RenameContainerDialog
        open={renameDialogOpen}
        handleClose={() => setRenameDialogOpen(false)}
        handleConfirmation={handleRename}
        dialogTitle="Renaming Container"
        dialogText="What should the container be renamed to?"
        label="Container Name"
      />
      <NewContainerDialog
        open={createContainerDialogOpen}
        handleClose={() => setCreateContainerDialogOpen(false)}
        handleConfirmation={createNewContainer}
        dialogTitle="Run a new Container"
        servers={Object.keys(overviewData).map((servername) => {
          if (overviewData[servername].commandRequestTopic) {
            return {
              name: servername,
              url: overviewData[servername].commandRequestTopic,
            };
          }
        })}
      />
    </React.Fragment>
  );
}

export default Overview;
