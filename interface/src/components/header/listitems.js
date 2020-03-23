import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BarChartIcon from "@material-ui/icons/BarChart";
import BuildIcon from "@material-ui/icons/Build";
import ListSubheader from "@material-ui/core/ListSubheader";

export const overviewItems = (
  <div>
    <ListItem button>
      <ListItemIcon style={{ paddingLeft: "6px" }}>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Overview" />
    </ListItem>
    <ListItem button>
      <ListItemIcon style={{ paddingLeft: "6px" }}>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Container Stats" />
    </ListItem>
  </div>
);

export const commandItems = (
  <div>
    <ListSubheader inset>Commands</ListSubheader>
    <ListItem button>
      <ListItemIcon style={{ paddingLeft: "6px" }}>
        <BuildIcon />
      </ListItemIcon>
      <ListItemText primary="Configure" />
    </ListItem>
  </div>
);
