import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BarChartIcon from "@material-ui/icons/BarChart";
import BuildIcon from "@material-ui/icons/Build";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link as RouterLink } from "react-router-dom";

import {
  OVERVIEW_URL,
  COMMANDS_URL,
  RESSOURCE_USAGE_URL
} from "../../util/navigationEndpoints";

function ListItemLink({ icon, text, link }) {
  const renderLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <RouterLink ref={ref} to={link} {...linkProps} />
      )),
    [link]
  );

  return (
    <ListItem button component={renderLink}>
      <ListItemIcon style={{ paddingLeft: "6px" }}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export const overviewItems = (
  <div>
    <ListItemLink
      icon={<DashboardIcon />}
      text="Overview"
      link={OVERVIEW_URL}
    />
    <ListItemLink
      icon={<BarChartIcon />}
      text="Container Stats"
      link={RESSOURCE_USAGE_URL}
    />
  </div>
);

export const commandItems = (
  <div>
    <ListSubheader inset>Commands</ListSubheader>
    <ListItemLink icon={<BuildIcon />} text="Configure" link={COMMANDS_URL} />
  </div>
);
