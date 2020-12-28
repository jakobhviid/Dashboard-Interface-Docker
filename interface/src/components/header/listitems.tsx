import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard"
import BarChartIcon from "@material-ui/icons/BarChart";
import KerberosIcon from "@material-ui/icons/Pets"
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
    {ListItemLink(<DashboardIcon/>, "Overview", OVERVIEW_URL)}
    {ListItemLink(<BarChartIcon/>, "Container Stats" , RESSOURCE_USAGE_URL)}
    {ListItemLink(<KerberosIcon/>, "Kerberos", KERBEROS_URL)}
    </div>
  )
}

export default overviewItems
