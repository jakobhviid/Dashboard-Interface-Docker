import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Switch from "@material-ui/core/Switch";
import CircularProgress from "@material-ui/core/CircularProgress";
import ContainerTable from "../../components/container_table/ContainerTable.component";

import {
  startCollectingRessources,
  stopCollectingRessources,
  reconfigureContainer,
} from "../../redux/container_data/containerData.effects";
import ReconfigureContainerDialog from "../../components/dialogs/reconfigure_dialog/ReconfigureContainerDialog.component";

const columns = {
  perServerView: [
    { title: "Name", field: "name" },
    { title: "Id", field: "id" },
    { title: "CPU %", field: "cpu_percentage" },
    { title: "Memory %", field: "memory_percentage" },
    { title: "Net I / O", field: "net_i_o" },
    { title: "Disk I / O", field: "disk_i_o" },
  ],
  containerView: [
    { title: "Name", field: "name" },
    { title: "Id", field: "id" },
    { title: "CPU %", field: "cpu_percentage" },
    { title: "Memory %", field: "memory_percentage" },
    { title: "Net I / O", field: "net_i_o" },
    { title: "Disk I / O", field: "disk_i_o" },
    { title: "Server", field: "servername" },
  ],
};

function RessourceUsage() {
  const [serverMode, setServerMode] = React.useState(true);
  const [selectedContainer, setSelectedContainer] = React.useState(null);
  const [reconfigureDialogOpen, setReconfigureDialogOpen] = React.useState(
    false
  );
  const dispatch = useDispatch();
  const serverContainers = useSelector(
    (store) => store.containerData.statsData
  );

  const actions = [
    {
      label: "Update Configuration",
      onClick: (selectedContainer) => {
        setSelectedContainer(selectedContainer);
        setReconfigureDialogOpen(true);
      },
    },
  ];

  const handleReconfigure = (values) => {
    dispatch(reconfigureContainer(selectedContainer, values));
  };

  React.useEffect(() => {
    dispatch(startCollectingRessources());
    return () => {
      dispatch(stopCollectingRessources());
    };
  }, [dispatch]);

  let containerView = null;
  if (Object.keys(serverContainers).length !== 0) {
    if (!serverMode) {
      containerView = [];
      for (const servername of Object.keys(serverContainers)) {
        for (const container of serverContainers[servername].containers) {
          containerView.push({ ...container, servername });
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
        Object.keys(containerView).map((servername) => (
          <div style={{ marginBottom: "18px" }} key={servername}>
            <ContainerTable
              title={servername}
              columns={columns.perServerView}
              data={containerView[servername].containers}
              dense="small"
              actions={actions}
            />
          </div>
        ))
      ) : (
        <ContainerTable
          title="All Containers"
          columns={columns.containerView}
          data={containerView}
          dense="small"
          actions={actions}
        />
      )}
      <ReconfigureContainerDialog
        open={reconfigureDialogOpen}
        handleClose={() => setReconfigureDialogOpen(false)}
        handleConfirmation={handleReconfigure}
        dialogTitle="Reconfiguring Container"
        dialogText="How should the container be configured?"
        label="Container Name"
      />
    </React.Fragment>
  );
}

export default RessourceUsage;
