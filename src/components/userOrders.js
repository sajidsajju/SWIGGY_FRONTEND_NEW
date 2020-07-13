import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Navbar from "./userNavbar";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
// import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
import { Fab, Grid } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
// import Container from "@material-ui/core/Container";
import { orange } from "@material-ui/core/colors";
// import { useSelector, useDispatch } from "react-redux";
// import { isLogged } from "./actions";
import axios from "axios";
// import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Error from "../components/forms/loginErrors";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Image from "material-ui-image";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { userLogged } from "../components/actions";
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';


const theme = createMuiTheme({
  palette: {
    primary: { main: "#36454f" },
    secondary: {
      main: "#002984",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    // backgroundColor: theme.palette.secondary.main,
    backgroundColor: "#36454f",
  },
  form: {
    width: "50%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loginError: {
    paddingTop: 20,
    paddingLeft: "25%",
    fontSize: 17,
    fontFamily: "Helvetica",
    color: "#d8000c",
  },
  title: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: orange,
  },
}));

export default function RestOrders({match}) {
  document.title = "User Orders";
  // const history = useHistory();
  const classes = useStyles();
  const [getOrderData, setGetOrderData] = useState({});
  
  let isLoggedState = useSelector((state) => state.userLogged);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    try {
      const { exp } = jwtDecode(token);
      const expirationTime = exp * 1000 - 10000;
      if (Date.now() >= expirationTime) {
        dispatch(userLogged(false));
        localStorage.removeItem("user-token");
      }
    } catch (e) { }
    if (token) dispatch(userLogged(true));
    else dispatch(userLogged(false));

  const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    const fetchData = async() => { 
    await axios
     .get("http://localhost:5000/api/getParticularOrders/"+match.params.id, config)
      .then((res) => {
        if (res.data.success) {
            setGetOrderData(res.data.message);
        }
      })
      .catch((err) => console.log(err));
    }
    fetchData();
    
  }, []);

   function loggedOut() {
    dispatch(userLogged(false));
    localStorage.removeItem("user-token");
  }
  if (!isLoggedState) {
    return <Redirect to="/" />;
  }
  
  return (
    <div>
      <Navbar
        link="/"
        authToken="user-token"
        loggedOut={loggedOut}
        disabling=""
        homeDisabling=""
        cartDisabling=""
        ordersDisabling=""
      />
      
    
    <Grid
        container
        directio="column"
        justify="center"
        alignItems="center"
      // spacing={6}
      >
        <Grid item xs={6} className="typo">
            <div>
           <p style={{margin: 30}}> Delivery Boy Name : {getOrderData.dname}</p>
           <p style={{margin: 30}}>Phone : {getOrderData.delPhone}</p>
           </div>
        </Grid>
        <Grid item xs={6} className="typo">
        <div>
             <p>Restaurant : {getOrderData.rname}</p>
             <p>Restaurant Owner : {getOrderData.restOwnerName}</p>
             <p>Phone : {getOrderData.restPhone}</p>
             </div>
        </Grid>
        </Grid>
        <hr
                            style={{
                              backgroundColor: "black",
                              height: 1,
                            //   width: 600,
                            }}
                          />
        <Grid container directio="column"
        justify="center" spacing={3}
     >
            {getOrderData.items ? getOrderData.items.map((item) => (
                <Grid item xs={4} key={item._id}>
                <div style={{margin: 20}}>
                    <div style={{ width: 80, height: 80 }}>
                    <Image disableSpinner={true} src={item.itemImage ? `http://localhost:5000/uploads/${item.itemImage}` : ""} />
                    </div>
            <p>Item Name : {item.itemName}</p>
            <p>Count: {item.count}</p>
                </div>    
                </Grid>
            )): <div></div>
            }
            </Grid>
    
    
    </div>
  )
};
