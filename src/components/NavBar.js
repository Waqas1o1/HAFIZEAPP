import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import { Avatar, Collapse, Grid, Typography } from "@material-ui/core";
import ImportExportIcon from "@material-ui/icons/ImportExport";
// import FindReplaceOutlinedIcon from '@material-ui/icons/FindReplaceOutlined';
import DashboardIcon from "@material-ui/icons/Dashboard";
import { Link } from "react-router-dom";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import PregnantWomanIcon from "@material-ui/icons/PregnantWoman";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { connect } from "react-redux";
import { authCheckState, authLogout } from "../store/actions/auth";
import GroupStatus from "../utils/status";
import { deepOrange } from "@material-ui/core/colors";
import ContactsIcon from "@material-ui/icons/Contacts";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import SettingsIcon from "@material-ui/icons/Settings";
import PlaceIcon from "@material-ui/icons/Place";
import VideogameAssetSharpIcon from "@material-ui/icons/VideogameAssetSharp";
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  white: {
    color: "#ffffff",
  },
  input: {
    color: "#ffffff",
  },
  link: {
    textDecoration: "none",
  },
  linkText: {
    color: "#6b6b6b",
  },
  flexGrow: {
    flexGrow: 1,
  },
  avater: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: "25%",
  },
  overyLayIcon: {
    position: "absolute",
    fontSize: "14px",
    top: "14.5px",
    left: "19px",
    color: "white",
  },
}));

function NavBar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [openLedger, setpOenLedger] = React.useState(false);
  const [openAdd, setpOenAdd] = React.useState(false);
  const [openManagment, setOpenManagment] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSalesOfficer, setIsSalesOfficer] = useState(false);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    props.onLoad();
    const checkSatus = async (gp) => {
      if (gp === GroupStatus.SUPERUSER) {
        setIsAdmin(true);
      } else if (gp === GroupStatus.SALESOFFICER) {
        setIsSalesOfficer(true);
      }
    };
    checkSatus(props.group);
  }, [props]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenLedgerClick = () => {
    setpOenLedger(!openLedger);
  };
  const handleOpenAddClick = () => {
    setpOenAdd(!openAdd);
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <div className={classes.flexGrow}>
            {props.authenticated ? (
              <IconButton
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={`${clsx(classes.menuButton, open && classes.hide)} ${
                  classes.white
                }`}
              >
                <MenuIcon />
              </IconButton>
            ) : null}
          </div>
          <div>
            {props.authenticated ? (
              <Grid container justifyContent="center" spacing={3}>
                <Grid item>
                  <Avatar className={classes.avater}>
                    {props.group.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="inherit" className={classes.white}>
                    {localStorage.getItem("displayname")}
                  </Typography>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item>
                  <IconButton
                    aria-label="Logout"
                    onClick={props.logout}
                    className={classes.white}
                  >
                    <ExitToAppIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ) : (
              <Link to="/login">
                <IconButton aria-label="Login" className={classes.white}>
                  <VpnKeyIcon />
                </IconButton>
              </Link>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {/* Main */}
          {isAdmin ? (
            <>
              <Link
                to="/graph"
                className={`${classes.link} ${classes.linkText}`}
              >
                <ListItem button key={"DashBorad"} onClick={handleDrawerClose}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItem>
              </Link>
            </>
          ) : undefined}
          <Link to="/" className={`${classes.link} ${classes.linkText}`}>
            <ListItem button key={"Components"} onClick={handleDrawerClose}>
              <ListItemIcon>
                <SettingsInputComponentIcon />
              </ListItemIcon>
              <ListItemText primary={"Dashboard 2"} />
            </ListItem>
          </Link>
          <Divider />

          {/* Add  */}
          {isAdmin ? (
            <>
              <ListItem button onClick={handleOpenAddClick}>
                <ListItemIcon>
                  <QueuePlayNextIcon />
                </ListItemIcon>
                <ListItemText primary="Add Entities" />
                {openAdd ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openAdd} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Link
                    to="/addParty"
                    className={`${classes.link} ${classes.linkText}`}
                  >
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={handleDrawerClose}
                    >
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary="Add Party" />
                    </ListItem>
                  </Link>
                  <Link
                    to="/addSupplier"
                    className={`${classes.link} ${classes.linkText}`}
                  >
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={handleDrawerClose}
                    >
                      <ListItemIcon>
                        <ContactsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Add Supplier" />
                    </ListItem>
                  </Link>
                  <Link
                    to="/addPartyDiscount"
                    className={`${classes.link} ${classes.linkText}`}
                  >
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={handleDrawerClose}
                    >
                      <ListItemIcon>
                        <PersonAddIcon />
                      </ListItemIcon>
                      <ListItemText primary="Add Party Discount" />
                    </ListItem>
                  </Link>
                  <Link
                    to="/addCategory"
                    className={`${classes.link} ${classes.linkText}`}
                  >
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={handleDrawerClose}
                    >
                      <ListItemIcon>
                        <AddToPhotosIcon />
                      </ListItemIcon>
                      <ListItemText primary="Add Category" />
                    </ListItem>
                  </Link>
                  <Link
                    to="/addProduct"
                    className={`${classes.link} ${classes.linkText}`}
                  >
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={handleDrawerClose}
                    >
                      <ListItemIcon>
                        <AccountTreeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Add product" />
                    </ListItem>
                  </Link>
                  <Link
                    to="/addBank"
                    className={`${classes.link} ${classes.linkText}`}
                  >
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={handleDrawerClose}
                    >
                      <ListItemIcon>
                        <AccountBalanceIcon />
                      </ListItemIcon>
                      <ListItemText primary="Add Bank" />
                    </ListItem>
                  </Link>
                  <Link
                    to="/addArea"
                    className={`${classes.link} ${classes.linkText}`}
                  >
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={handleDrawerClose}
                    >
                      <ListItemIcon>
                        <PlaceIcon />
                      </ListItemIcon>
                      <ListItemText primary="Add Area" />
                    </ListItem>
                  </Link>
                </List>
              </Collapse>
              <Divider />
            </>
          ) : undefined}
          {/* Ledgers */}
          {isAdmin | isSalesOfficer ? (
            <>
              <ListItem button onClick={handleOpenLedgerClick}>
                <ListItemIcon>
                  <MenuBookIcon />
                </ListItemIcon>
                <ListItemText primary="Ledger" />
                {openLedger ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openLedger} timeout="auto" unmountOnExit>
                <Link
                  to="/PartyLedger"
                  className={`${classes.link} ${classes.linkText}`}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={handleDrawerClose}
                  >
                    <ListItemIcon>
                      <AddToPhotosIcon />
                    </ListItemIcon>
                    <ListItemText primary="Party Ledger" />
                  </ListItem>
                </Link>
                {isAdmin ? (
                  <>
                    <Link
                      to="/CashLedger"
                      className={`${classes.link} ${classes.linkText}`}
                    >
                      <ListItem
                        button
                        className={classes.nested}
                        onClick={handleDrawerClose}
                      >
                        <ListItemIcon>
                          <LocalAtmIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cash Ledger" />
                      </ListItem>
                    </Link>

                    <Link
                      to="/SalesOfficerLedger"
                      className={`${classes.link} ${classes.linkText}`}
                    >
                      <ListItem
                        button
                        className={classes.nested}
                        onClick={handleDrawerClose}
                      >
                        <ListItemIcon>
                          <PregnantWomanIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sales Officer Ledger" />
                      </ListItem>
                    </Link>
                    <Link
                      to="/SalesLedger"
                      className={`${classes.link} ${classes.linkText}`}
                    >
                      <ListItem
                        button
                        className={classes.nested}
                        onClick={handleDrawerClose}
                      >
                        <ListItemIcon>
                          <ReceiptIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sales Ledger" />
                      </ListItem>
                    </Link>

                    <Link
                      to="/BankLedger"
                      className={`${classes.link} ${classes.linkText}`}
                    >
                      <ListItem
                        button
                        className={classes.nested}
                        onClick={handleDrawerClose}
                      >
                        <ListItemIcon>
                          <AccountBalanceIcon />
                        </ListItemIcon>
                        <ListItemText primary="Bank Ledger" />
                      </ListItem>
                    </Link>
                  </>
                ) : undefined}
              </Collapse>
              <Divider />
            </>
          ) : undefined}
          {isAdmin ? (
            <>
              <ListItem button onClick={() => setOpenManagment(!openManagment)}>
                <ListItemIcon>
                  <VideogameAssetSharpIcon />
                </ListItemIcon>
                <ListItemText primary="Managment" />
                {openLedger ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openManagment} timeout="auto" unmountOnExit>
                <Link
                  to="/VehicalsManagment"
                  className={`${classes.link} ${classes.linkText}`}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={handleDrawerClose}
                  >
                    <ListItemIcon>
                      <SettingsIcon className={classes.overyLayIcon} />
                      <LocalShippingIcon />
                    </ListItemIcon>
                    <ListItemText primary="Fleet Managment" />
                  </ListItem>
                </Link>
                <Link
                  to="/EmployeeMangement"
                  className={`${classes.link} ${classes.linkText}`}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={handleDrawerClose}
                  >
                    <ListItemIcon>
                      <SupervisedUserCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Employ Managment" />
                  </ListItem>
                </Link>
                <Link
                  to="/Adjustments"
                  className={`${classes.link} ${classes.linkText}`}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={handleDrawerClose}
                  >
                    <ListItemIcon>
                      <MenuBookIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ledger Adjustments" />
                  </ListItem>
                </Link>
                <Link
                  to="/Import"
                  className={`${classes.link} ${classes.linkText}`}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={handleDrawerClose}
                  >
                    <ListItemIcon>
                      <ImportExportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Import" />
                  </ListItem>
                </Link>
              </Collapse>
            </>
          ) : undefined}
        </List>
      </Drawer>
      <main className={clsx(classes.content, { [classes.contentShift]: open })}>
        <div className={classes.drawerHeader} />
        {props.children}
      </main>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.token !== null,
    group: state.group,
  };
};
const mapDispacthToProps = (dispacth) => {
  return {
    onLoad: () => dispacth(authCheckState()),
    logout: () => dispacth(authLogout()),
  };
};
export default connect(mapStateToProps, mapDispacthToProps)(NavBar);
