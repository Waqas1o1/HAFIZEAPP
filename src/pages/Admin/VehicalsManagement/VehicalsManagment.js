import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import ExtensionIcon from "@material-ui/icons/Extension";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import BuildIcon from "@material-ui/icons/Build";
import AccountTreeSharpIcon from "@material-ui/icons/AccountTreeSharp";
import AddSharpIcon from "@material-ui/icons/AddSharp";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "130px",
    width: "130px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  f60: {
    fontSize: 60,
  },
  f40: {
    fontSize: 40,
  },
  textWhite: {
    color: "white",
  },
  bgBlue: {
    backgroundColor: theme.palette.secondary.main,
  },
  link: {
    textDecoration: "None",
    fontSize: "12px",
  },
  overyLayIcon: {
    position: "absolute",
    marginLeft: "-4px",
    marginTop: "-20px",
    fontSize: "25px",
    color: theme.palette.secondary.main,
  },
 
}));
export default function VehicalsManagment() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h3" color="primary" gutterBottom>
        Fleet Management
      </Typography>

      <Grid
        container
        style={{ padding: "30px" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={2}
          container
          justifyContent="center"
        >
          <Link className={classes.link} to="/addVehical">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <AddSharpIcon className={classes.overyLayIcon} />
              <LocalShippingIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                Vehical
              </Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={2}
          container
          justifyContent="center"
        >
          <Link className={classes.link} to="/addVehicalProducts">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <AccountTreeSharpIcon className={classes.overyLayIcon} />
              <LocalShippingIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                Products
              </Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={2}
          container
          justifyContent="center"
        >
          <Link className={classes.link} to="/addSapreParts">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <ExtensionIcon className={classes.overyLayIcon} />
              <LocalShippingIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                Spare Parts
              </Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={2}
          container
          justifyContent="center"
        >
          <Link className={classes.link} to="/dipatchPart">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <BuildIcon className={classes.overyLayIcon} />
              <LocalShippingIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                Spare Parts
              </Typography>
            </Paper>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}
