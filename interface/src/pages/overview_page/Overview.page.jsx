import React from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import ContainerTable from "../../components/container_table/ContainerTable.component";

import {
  startCollectingOverview,
  renameContainer,
  startOrStopContainer,
  restartContainer,
  stopCollectingOverview,
  removeContainer,
} from "../../redux/container_data/containerData.effects";
import RenameContainerDialog from "../../components/dialogs/RenameContainerDialog.component";

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

function findServerNameOfContainer(serverContainers, container) {
  for (const server of Object.keys(serverContainers)) {
    for (const serverContainer of serverContainers[server]) {
      if (serverContainer.id === container.id) {
        return server;
      }
    }
  }
}

function Overview() {
  const [serverMode, setServerMode] = React.useState(true);
  const [selectedContainer, setSelectedContainer] = React.useState(null);
  const dispatch = useDispatch();
  const serverContainers = useSelector(
    (store) => store.containerData.overviewData
  );

  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);

  const handleRename = (newName) => {
    const serverName = findServerNameOfContainer(
      serverContainers,
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
          serverContainers,
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
            findServerNameOfContainer(serverContainers, selectedContainer),
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
            findServerNameOfContainer(serverContainers, selectedContainer),
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
  if (Object.keys(serverContainers).length !== 0) {
    if (!serverMode) {
      containerView = [];
      for (const servername of Object.keys(serverContainers)) {
        for (const container of serverContainers[servername]) {
          // JSON parse and stringify to create mutable object
          containerView.push({
            ...JSON.parse(JSON.stringify(container)),
            servername,
          });
        }
      }
    } else {
      containerView = JSON.parse(JSON.stringify(serverContainers));
    }
  }

  return Object.keys(serverContainers).length === 0 ? (
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
                data={containerView[servername]}
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
      <RenameContainerDialog
        open={renameDialogOpen}
        handleClose={() => setRenameDialogOpen(false)}
        handleConfirmation={handleRename}
        dialogText="What should the container be renamed to?"
        dialogTitle="Renaming Container"
        label="Container Name"
      />
    </React.Fragment>
  );
}

export default Overview;
