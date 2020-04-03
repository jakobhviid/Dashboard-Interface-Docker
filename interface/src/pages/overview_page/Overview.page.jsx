import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import ContainerTable from "../../components/container_table/ContainerTable.component";

import { startCollectingOverview } from "../../redux/overview/overview.effects";
import { selectCollectedData } from "../../redux/overview/overview.selectors";

const columns = {
  perServerView: [
    { title: "Name", alignment: "left", field: "name" },
    { title: "Id", alignment: "left", field: "id" },
    { title: "Image", alignment: "left", field: "image" },
    {
      title: "State",
      alignment: "left",
      field: "state.status"
    },
    {
      title: "Creation Time",
      alignment: "left",
      field: "creation_time"
    }
  ],
  containerView: [
    { title: "Name", alignment: "left", field: "name" },
    { title: "Id", alignment: "left", field: "id" },
    { title: "Image", alignment: "left", field: "image" },
    {
      title: "State",
      alignment: "left",
      field: "state.status"
    },
    {
      title: "Creation Time",
      alignment: "left",
      field: "creation_time"
    },
    {
      title: "Server",
      alignment: "left",
      field: "servername"
    }
  ]
};

function Overview({ serverContainers, startCollectingData }) {
  const [serverMode, setServerMode] = React.useState(true);

  const actions = [
    {
      label: "Rename",
      onClick: selectedContainer =>
        console.log("Renaming", selectedContainer.name)
    },
    {
      label: "Start/Stop",
      onClick: selectedContainer =>
        console.log("Starting/Stopping", selectedContainer.name)
    },
    {
      label: "Restart",
      onClick: selectedContainer =>
        console.log("Restarting", selectedContainer.name)
    },
    {
      label: "Remove",
      onClick: selectedContainer =>
        console.log("Removing", selectedContainer.name)
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
        Object.keys(containerView).map(servername => {
          return (
            <div style={{ marginBottom: "18px" }} key={servername}>
              <ContainerTable
                title={servername}
                columns={columns.perServerView}
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
  startCollectingData: () => dispatch(startCollectingOverview())
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
