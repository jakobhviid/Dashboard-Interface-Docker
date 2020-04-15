import React from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

import WarningIcon from "@material-ui/icons/Warning";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import { Typography, Grid, Button } from "@material-ui/core";

import { clearAllWarnings } from "../../redux/monitoring_events/monitoringEvents.actions";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
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

// TODO - center item inside menu
const NotificationAction = withStyles((theme) => ({
  root: {
    margin: "auto",
  },
}))(MenuItem);

function NotificationMenu({ anchorEl, handleClose }) {
  const dispatch = useDispatch();
  const monitorEvents = useSelector(
    (store) => store.monitoringEvents.activeWarnings
  );

  return (
    <StyledMenu
      id="notifications-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        style: {
          maxHeight: 500,
        },
      }}
    >
      {monitorEvents.map((event, index) => {
        return (
          <div key={index}>
            <MenuItem>
              <ListItemIcon>
                <WarningIcon color="error" />
              </ListItemIcon>
              <Grid container spacing={1} direction="column">
                <Grid container style={{ minWidth: "450px" }}>
                  <Grid item xs={8}>
                    <Typography variant="h6">{event.type}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" style={{ paddingLeft: "16px" }}>
                      {moment(event.warningTime).fromNow()}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Container Name:</strong> {event.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Container Id:</strong> {event.id}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Server:</strong> {event.server}
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
              dispatch(clearAllWarnings());
              handleClose();
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
