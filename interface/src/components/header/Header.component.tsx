import React from "react";
import { withRouter, Link as RouterLink, useHistory } from "react-router-dom";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";

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
import EditIcon from "@material-ui/icons/Edit";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import Avatar from "@material-ui/core/Avatar";

import useStyles from "./Header.styles";
import overviewItems from "./listitems";
import NotificationMenu from "./notification_menu/NotificationMenu.component";
import { IRootState } from "../../types/redux/reducerStates.types";
import { LOGIN_URL, OVERVIEW_URL, PROFILE_URL } from "../../util/navigationEndpoints";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { logout } from "../../redux/user/user.actions";

function Header() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] = React.useState(null);
  const monitorEvents = useSelector((store: IRootState) => store.monitoringEvents.activeWarnings);
  const headerTitle = useSelector((store: IRootState) => store.ui.headerTitle);
  const userJwt = useSelector((store: IRootState) => store.user.jwt);
  const userDisplayName = useSelector((store: IRootState) => store.user.displayName);
  const accountMenuOpen = Boolean(anchorEl);
  const routeHistory = useHistory();
  const dispatch = useDispatch();
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
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                color="inherit"
              >
                <Avatar className={styleClasses.avatar}>{userDisplayName.substring(0, 2).toUpperCase()}</Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                open={accountMenuOpen}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem component={RouterLink} to={PROFILE_URL} onClick={() => setAnchorEl(null)}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    dispatch(logout())
                    setAnchorEl(null);
                    routeHistory.push(OVERVIEW_URL);
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Log out" />
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button component={RouterLink} to={LOGIN_URL} color="inherit" className={styleClasses.logInButton}>
              LOGIN
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
      </Drawer>

      <NotificationMenu anchorEl={notificationMenuAnchorEl} handleClose={handleNotificationMenuClose} />
    </React.Fragment>
  );
}

export default withRouter(Header);
