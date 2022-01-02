import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import { authLogin } from '../../store/actions/auth';

const MadeWithLove = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {"Built with love by the "}
    <Link color="inherit" href="">
      Technoventive Solutions
    </Link>
    {" team."}
  </Typography>
);

const useStyles = makeStyles(theme => ({
  root: {
    height: "85vh",
    display:'flex',
    justifyContent:'center',
    alignContent:'center'
  },
  image: {
    // backgroundImage: "url(http://faisalfeeds.com/wp-content/uploads/2018/03/novogen.png)",
    backgroundImage: "url(https://www.homenish.com/wp-content/uploads/2020/09/Cement-Vs-Concrete-1200x675.jpg)",
    backgroundRepeat: "no-repeat",
    // backgroundSize: "350px",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = (props) => {
  const classes = useStyles();
  const initialFields = {
    username:'',
    password:''
  }
  const [fields,setFiedls] = useState(initialFields);

    const handleOnChange = (e) =>{
        setFiedls({
            ...fields,
            [e.target.name] : e.target.value
        })
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        props.login(fields.username, fields.password);
        
    }
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={fields.username}
              label="Username"
              name="username"
              autoComplete="Username"
              onChange={handleOnChange}
              inputProps={{ style: {textTransform: "lowercase" }}}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              onChange={handleOnChange}
            />
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
           
            <Box mt={5}>
              <MadeWithLove />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = state =>{
    return {
      authenticated: state.token !== null,
      error:state.error,
      loading:state.loading,
    };
  }
  const mapDispacthToProps = dispacth =>{
    return {
      login : (username, password )=>dispacth(authLogin(username, password))
    }
  }
export default connect(mapStateToProps, mapDispacthToProps)(Login);
