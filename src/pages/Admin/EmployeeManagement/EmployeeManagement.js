import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import BuildIcon from "@material-ui/icons/Build";
import LocalConvenienceStoreIcon from "@material-ui/icons/LocalConvenienceStore";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import WorkIcon from "@material-ui/icons/Work";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import TodayIcon from "@material-ui/icons/Today";
import CreditCardIcon from "@material-ui/icons/CreditCard";

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
  overyLayIcon2: {
    position: "absolute",
    marginLeft: "-1px",
    marginTop: "-13px",
    fontSize: "25px",
    color: theme.palette.secondary.main,
  },
}));
export default function EmployeeMangement() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h3" color="primary" gutterBottom>
        Employees Management
      </Typography>

      <Grid
        container
        style={{ padding: "30px" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Link className={classes.link} to="/addEmployee">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <PersonAddIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />

              <Typography
                variant="button"
                className={classes.textWhite}
                display="block"
                gutterBottom
              >
                Employee
              </Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Link className={classes.link} to="/addDepartment">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <LocalConvenienceStoreIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                Departments
              </Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Link className={classes.link} to="/addRole">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <BuildIcon className={classes.overyLayIcon2} />
              <WorkIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                ROLES
              </Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Link className={classes.link} to="/advancePayment">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <SpellcheckIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                Advance Pay
              </Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Link className={classes.link} to="/dipatchPart">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <AccountBalanceWalletIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                Salary
              </Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Link className={classes.link} to="/dipatchPart">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <CreditCardIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                Loan
              </Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Link className={classes.link} to="/dipatchPart">
            <Paper className={`${classes.paper} ${classes.bgBlue}`}>
              <TodayIcon
                fontSize="large"
                className={`${classes.textWhite} ${classes.f60}`}
              />
              <Typography
                variant="button"
                className={`${classes.textWhite}`}
                display="block"
                gutterBottom
              >
                Attendance
              </Typography>
            </Paper>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}
