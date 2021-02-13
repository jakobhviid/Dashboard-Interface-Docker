import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Switch from "@material-ui/core/Switch";
import ContainerTable from "../../components/container_table/ContainerTable.component";
import { Typography, Button } from "@material-ui/core";

import { changeHeaderTitle } from "../../redux/ui/ui.actions";
import ReconfigureContainerDialog from "../../components/dialogs/reconfigure_dialog/ReconfigureContainerDialog.component";
import { IRootState } from "../../types/redux/reducerStates.types";
import {containerLoadStart} from "../../redux/container_data/containerData.actions";
import {REFETCH_STATS_DATA} from "../../util/socketEvents";
import {HubConnection} from "@microsoft/signalr";

const columns = {
  perServerView: [
    { title: "Name", field: "name" },
    { title: "Id", field: "id" },
    { title: "CPU %", field: "cpuPercentage" },
    { title: "Memory %", field: "memoryPercentage" },
    { title: "Net I / O", field: "netIO" },
    { title: "Disk I / O", field: "diskIO" },
  ],
  containerView: [
    { title: "Name", field: "name" },
    { title: "Id", field: "id" },
    { title: "CPU %", field: "cpuPercentage" },
    { title: "Memory %", field: "memoryPercentage" },
    { title: "Net I / O", field: "netIO" },
    { title: "Disk I / O", field: "diskIO" },
    { title: "Server", field: "servername" },
  ],
};

function RessourceUsage() {
  const [serverMode, setServerMode] = React.useState(true);
  const [selectedContainer, setSelectedContainer] = React.useState(null);
  const [reconfigureDialogOpen, setReconfigureDialogOpen] = React.useState(false);
  const dispatch = useDispatch();
  const serverContainers = useSelector((store: IRootState) => store.containerData.statsData);
  const userJwt = useSelector((store: IRootState) => store.user.jwt);
  const socketConnection: HubConnection | undefined = useSelector((store: IRootState) => store.containerData.socketConnection);

  React.useEffect(() => {
    dispatch(changeHeaderTitle("Container Ressource Usage"));
  }, [dispatch]);

  const actions = [
    {
      label: "Update Configuration",
      onClick: (selectedContainer: any) => {
        setSelectedContainer(selectedContainer);
        setReconfigureDialogOpen(true);
      },
    },
  ];

  const handleReconfigure = (values: any) => {
    // dispatch(reconfigureContainer(selectedContainer, values)); TODO:
  };

  const refetchContainers = (servers: string[]) => {
    if (!serverMode) {
      for (const servername of Object.keys(serverContainers)) {
        dispatch(containerLoadStart(serverContainers[servername].containers.map((container) => container.id)));
        if (serverContainers[servername].commandRequestTopic && socketConnection !== undefined)
          socketConnection.invoke(REFETCH_STATS_DATA, serverContainers[servername].commandRequestTopic);
      }
    } else {
      servers.forEach((servername) => {
        const containerIds = serverContainers[servername].containers.map((container) => container.id);
        dispatch(containerLoadStart(containerIds));
        if (serverContainers[servername].commandRequestTopic && socketConnection !== undefined)
          socketConnection.invoke(REFETCH_STATS_DATA, serverContainers[servername].commandRequestTopic);
      });
    }
  };

  let containerView: any = null;
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

  if (userJwt == null) {
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
      </div>
    );
  } else if (Object.keys(serverContainers).length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Looks like you don't have any running servers at the moment
        </Typography>
        <Button variant="outlined" color="secondary">
          ADD NEW SERVER
        </Button>
      </div>
    );
  }

  return (
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
              onRefetch={() => refetchContainers([servername])}
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
          onRefetch={refetchContainers}
        />
      )}
      <ReconfigureContainerDialog
        open={reconfigureDialogOpen}
        handleClose={() => setReconfigureDialogOpen(false)}
        handleConfirmation={handleReconfigure}
        dialogTitle="Reconfiguring Container"
      />
    </React.Fragment>
  );
}

export default RessourceUsage;
