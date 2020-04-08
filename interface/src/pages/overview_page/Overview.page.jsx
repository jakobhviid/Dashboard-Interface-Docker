import React from "react";
import { useDispatch, useSelector } from "react-redux";

import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import ContainerTable from "../../components/container_table/ContainerTable.component";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import {
  startCollectingOverview,
  renameContainer,
  startOrStopContainer,
  restartContainer,
  stopCollectingOverview,
  removeContainer,
  runContainer,
} from "../../redux/container_data/containerData.effects";
import RenameContainerDialog from "../../components/dialogs/rename_dialog/RenameContainerDialog.component";
import { findServerNameOfContainer } from "../../util/helpers";
import NewContainerDialog from "../../components/dialogs/newcontainer_dialog/NewContainerDialog.component";

import useStyles from "./Overview.styles";

const columnsServerView = [
  { title: "Name", alignment: "left", field: "name" },
  { title: "Id", alignment: "left", field: "id" },
  { title: "Image", alignment: "left", field: "image" },
  {
    title: "State",
    alignment: "left",
    field: "state.stringRepresentation",
  },
  {
    title: "Creation Time",
    alignment: "left",
    field: "creation_time",
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

function Overview() {
  const [serverMode, setServerMode] = React.useState(true);
  const [selectedContainer, setSelectedContainer] = React.useState(null);
  const [
    createContainerDialogOpen,
    setCreateContainerDialogOpen,
  ] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const dispatch = useDispatch();
  const overviewData = useSelector((store) => store.containerData.overviewData);

  const classes = useStyles();

  const handleRename = (newName) => {
    const serverName = findServerNameOfContainer(
      overviewData,
      selectedContainer
    );
    dispatch(renameContainer(serverName, selectedContainer, newName));
  };

  const actions = [
    {
      label: "Rename",
      onClick: (selectedContainer) => {
        setSelectedContainer(selectedContainer);
        setRenameDialogOpen(true);
      },
    },
    {
      label: "Start/Stop",
      onClick: (selectedContainer) => {
        const serverName = findServerNameOfContainer(
          overviewData,
          selectedContainer
        );
        dispatch(startOrStopContainer(serverName, selectedContainer));
      },
    },
    {
      label: "Restart",
      onClick: (selectedContainer) => {
        dispatch(
          restartContainer(
            findServerNameOfContainer(overviewData, selectedContainer),
            selectedContainer
          )
        );
      },
    },
    {
      label: "Remove",
      onClick: (selectedContainer) => {
        console.log("Removing", selectedContainer.name);
        dispatch(
          removeContainer(
            findServerNameOfContainer(overviewData, selectedContainer),
            selectedContainer
          )
        );
      },
    },
  ];

  React.useEffect(() => {
    dispatch(startCollectingOverview());

    return () => {
      dispatch(stopCollectingOverview());
    };
  }, [dispatch]);

  let containerView = null;

  if (Object.keys(overviewData).length !== 0) {
    if (!serverMode) {
      containerView = [];
      for (const servername of Object.keys(overviewData)) {
        for (const container of overviewData[servername].containers) {
          // JSON parse and stringify to create mutable object
          containerView.push({
            ...JSON.parse(JSON.stringify(container)),
            servername,
          });
        }
      }
    } else {
      containerView = JSON.parse(JSON.stringify(overviewData));
      console.log(containerView);
    }
  }

  function createNewContainer(values) {
    const objectToSend = {};

    if (values["image"] !== "") objectToSend["image"] = values["image"];
    if (values["name"] !== "") objectToSend["name"] = values["name"];
    if (values["command"] !== "") objectToSend["command"] = values["command"];

    if (values["restart_policy"]["name"] !== "{}") {
      const restartPolicyObject = { Name: values["restart_policy"]["name"] };
      if (values["restart_policy"]["maximumRetryCount"] !== "")
        restartPolicyObject["MaximumRetryCount"] =
          values["restart_policy"]["maximumRetryCount"];
      objectToSend["restart_policy"] = restartPolicyObject;
    }

    const ports = {};
    for (const port of values["ports"]) {
      ports[port.portContainer + "/tcp"] = port.portHost;
    }
    if (Object.keys(ports).length !== 0) objectToSend["ports"] = ports;

    const environmentVariables = [];
    for (const environment of values["environment"]) {
      environmentVariables.push(environment.key + "=" + environment.value);
    }
    if (environmentVariables.length !== 0)
      objectToSend["environment"] = environmentVariables;

    const volumes = {};
    for (const volume of values["volumes"]) {
      volumes[volume.hostPath] = { bind: volume.bind, mode: volume.mode };
    }
    if (Object.keys(volumes).length !== 0) objectToSend["volumes"] = volumes;

    dispatch(runContainer(values.server, objectToSend));
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
        // TODO - find all servers currently active, their name and actionURL and insert as list here
        servers={[{ name: "OliversMBPStation", url: "http://127.0.0.1:5000" }]}
      />
    </React.Fragment>
  );
}

export default Overview;
