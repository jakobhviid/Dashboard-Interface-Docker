import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Switch from "@material-ui/core/Switch";
import CircularProgress from "@material-ui/core/CircularProgress";
import ContainerTable from "../../components/container_table/ContainerTable.component";

import { startCollectingRessources } from "../../redux/ressource/ressource.effects";
import { selectCollectedData } from "../../redux/ressource/ressource.selectors";

const columns = {
  perServerView: [
    { title: "Name", field: "name" },
    { title: "Id", field: "id" },
    { title: "CPU %", field: "cpu_percentage" },
    { title: "Memory %", field: "memory_percentage" },
    { title: "Net I / O", field: "net_i_o" },
    { title: "Disk I / O", field: "disk_i_o" }
  ],
  containerView: [
    { title: "Name", field: "name" },
    { title: "Id", field: "id" },
    { title: "CPU %", field: "cpu_percentage" },
    { title: "Memory %", field: "memory_percentage" },
    { title: "Net I / O", field: "net_i_o" },
    { title: "Disk I / O", field: "disk_i_o" },
    { title: "Server", field: "servername" }
  ]
};

function RessourceUsage({ serverContainers, startCollectingData }) {
  const [serverMode, setServerMode] = React.useState(true);

  const actions = [
    {
      label: "Update Configuration",
      onClick: selectedContainer =>
        console.log("Restarting", selectedContainer.name)
    }
  ];

  React.useEffect(() => {
    startCollectingData();
  }, [startCollectingData]);

  let containerView = null;
  if (Object.keys(serverContainers).length !== 0) {
    if (!serverMode) {
      containerView = [];
      for (const servername of Object.keys(serverContainers)) {
        for (const container of serverContainers[servername]) {
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
        Object.keys(containerView).map(servername => (
          <div style={{ marginBottom: "18px" }} key={servername}>
            <ContainerTable
              title={servername}
              columns={columns.perServerView}
              data={containerView[servername]}
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
    </React.Fragment>
  );
}

const mapStateToProps = createStructuredSelector({
  serverContainers: selectCollectedData
});

const mapDispatchToProps = dispatch => ({
  startCollectingData: () => dispatch(startCollectingRessources())
});

export default connect(mapStateToProps, mapDispatchToProps)(RessourceUsage);
