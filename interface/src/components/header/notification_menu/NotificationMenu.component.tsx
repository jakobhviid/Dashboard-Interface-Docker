import React from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { IRootState } from "../../../types/redux/reducerStates.types";

import MenuItem from "@material-ui/core/MenuItem";
import Menu, {MenuProps} from "@material-ui/core/Menu";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

import WarningIcon from "@material-ui/icons/Warning";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import { Typography, Grid, Button, Fade } from "@material-ui/core";

import { clearAllWarnings } from "../../../redux/monitor_notification/monitorNotification.actions";
import useStyles from "./NotificationMenu.styles";
import {monitorNotificationType} from "../../../redux/monitor_notification/monitorNotification.types";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props : MenuProps) => (
  <Menu
    style={{ marginRight: "8px" }}
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

function NotificationMenu({ anchorEl, handleClose }: any) {
  const dispatch = useDispatch();
  const monitorEvents = useSelector(
    (store: IRootState) => store.monitoringEvents.activeWarnings
  );
  const classes = useStyles();

  return (
    <StyledMenu
      id="notifications-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{ style: { maxHeight: 500 } }}
      TransitionComponent={Fade}
    >
      {monitorEvents
        .slice(0)
        .reverse()
        .map((event, index) => {
          let notificationIcon = null;
          switch (event.type) {
            case monitorNotificationType.ERROR:
              notificationIcon = <ErrorIcon color="error" />;
              break;
            case monitorNotificationType.WARNING:
              notificationIcon = (
                <WarningIcon className={classes.warningIcon} />
              );
              break;
            case monitorNotificationType.INFO:
              notificationIcon = <InfoIcon className={classes.infoIcon} />;
              break;
            default:
              notificationIcon = <InfoIcon className={classes.infoIcon} />;
              break;
          }
          return (
            <div key={index}>
              <MenuItem>
                <ListItemIcon>{notificationIcon}</ListItemIcon>
                <Grid container spacing={1} direction="column">
                  <Grid container style={{ minWidth: "450px" }}>
                    <Grid item xs={8}>
                      <Typography variant="h6">{event.reason}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        variant="body2"
                        style={{ paddingLeft: "16px" }}
                      >
                        {moment(event.timestamp, "hh:mm:ss DD/MM/YY").fromNow()}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Container Name:</strong> {event.containerName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Container Id:</strong> {event.containerId}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Server:</strong> {event.serverName}
                    </Typography>
                    {event.extraInfo ? (
                      <Typography variant="body2">{event.extraInfo}</Typography>
                    ) : null}
                  </Grid>
                </Grid>
              </MenuItem>
              {index === monitorEvents.length - 1 ? null : <Divider />}
            </div>
          );
        })}
      {monitorEvents.length > 0 ? (
        <div style={{ textAlign: "center", margin: 8 }}>
          <Button
            variant="outlined"
            style={{ margin: "auto" }}
            startIcon={<ClearAllIcon />}
            onClick={() => {
              handleClose();
              dispatch(clearAllWarnings());
            }}
          >
            Clear All Notifications
          </Button>
        </div>
      ) : (
        <Typography variant="subtitle2" style={{ margin: 8 }}>
          No New Notifications
        </Typography>
      )}
    </StyledMenu>
  );
}
export default NotificationMenu;
