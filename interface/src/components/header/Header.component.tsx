import React from "react";
import { withRouter, Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import { useSelector } from "react-redux";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import Avatar from "@material-ui/core/Avatar";

import useStyles from "./Header.styles";
import { overviewItems } from "./listitems";
import NotificationMenu from "./notification_menu/NotificationMenu.component";
import { IRootState } from "../../types/redux/reducerStates.types";
import { LOGIN_URL } from "../../util/navigationEndpoints";

function Header() {
  const [open, setOpen] = React.useState(true);
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] = React.useState(null);
  const monitorEvents = useSelector((store: IRootState) => store.monitoringEvents.activeWarnings);
  const headerTitle = useSelector((store: IRootState) => store.ui.headerTitle);
  const userJwt = useSelector((store: IRootState) => store.user.jwt);
  const userDisplayName = useSelector((store: IRootState) => store.user.displayName);

  const handleNotificationClick = (event: any) => {
    setNotificationMenuAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const styleClasses = useStyles();

  return (
    <React.Fragment>
      <AppBar position="absolute" className={clsx(styleClasses.appBar, open && styleClasses.appBarShift)}>
        <Toolbar className={styleClasses.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(styleClasses.menuButton, open && styleClasses.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={styleClasses.title}>
            {headerTitle}
          </Typography>
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={monitorEvents.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {userJwt ? (
            <div>
              <Avatar className={styleClasses.avatar}>{userDisplayName.charAt(0)}</Avatar>
            </div>
          ) : (
            <Button component={RouterLink} to={LOGIN_URL} color="inherit" className={styleClasses.logInButton}>
              LOG IND
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(styleClasses.drawerPaper, !open && styleClasses.drawerPaperClose),
        }}
        open={open}
      >
        <div className={styleClasses.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{overviewItems}</List>
        {/* <Divider />
        <List>{commandItems}</List> */}
      </Drawer>

      <NotificationMenu anchorEl={notificationMenuAnchorEl} handleClose={handleNotificationMenuClose} />
    </React.Fragment>
  );
}

export default withRouter(Header);
