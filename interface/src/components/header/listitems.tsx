import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "../../../node_modules/@material-ui/icons/Dashboard"
import BarChartIcon from "../../../node_modules/@material-ui/icons/BarChart";
import KerberosIcon from "../../../node_modules/@material-ui/icons/Pets"
import { Link as RouterLink } from "react-router-dom";

import { OVERVIEW_URL, RESSOURCE_USAGE_URL, KERBEROS_URL } from "../../util/navigationEndpoints";

function ListItemLink(icon : any, text : string, link : string ) {
  const renderLink = React.useMemo(
    () => React.forwardRef((linkProps : any, ref : any) => <RouterLink ref={ref} to={link} {...linkProps} />),
    [link]
  );

  return (
    <ListItem button component={renderLink}>
      <ListItemIcon style={{ paddingLeft: "6px" }}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

function overviewItems(){
  return(
    <div>
    <ListItemLink icon={<DashboardIcon />} text="Overview" link={OVERVIEW_URL} />
    <ListItemLink icon={<BarChartIcon />} text="Container Stats" link={RESSOURCE_USAGE_URL} />
    <ListItemLink icon={<KerberosIcon />} text="Kerberos" link={KERBEROS_URL} />
    </div>
  )
}

export default overviewItems
