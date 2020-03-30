import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import MaterialTable from "material-table";

import { startCollectingOverview } from "../../redux/overview/overview.effects";
import { selectCollectedData } from "../../redux/overview/overview.selectors";

function Overview({ serverContainers, startCollectingData }) {
  const [serverMode, setServerMode] = React.useState(true);
  const [columns, setColumns] = React.useState({
    perServerView: [
      { title: "Name", field: "name" },
      { title: "Id", field: "id" },
      { title: "Image", field: "image" },
      { title: "State", field: "state.status" },
      { title: "Creation Time", field: "creation_time" }
    ],
    containerView: [
      { title: "Name", field: "name" },
      { title: "Id", field: "id" },
      { title: "Image", field: "image" },
      { title: "State", field: "state.status" },
      { title: "Creation Time", field: "creation_time" },
      { title: "Server", field: "servername" }
    ]
  });

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
            <MaterialTable
              title={servername}
              columns={columns.perServerView}
              data={containerView[servername]}
            />
          </div>
        ))
      ) : (
        <MaterialTable
          title="All Containers"
          columns={columns.containerView}
          data={containerView}
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
