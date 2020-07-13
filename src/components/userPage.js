import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import {
  makeStyles,
  withStyles,
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
import Menu from "@material-ui/core/Menu";
// import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Image from "material-ui-image";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { userLogged } from "../components/actions";
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TablePagination from '@material-ui/core/TablePagination';
import { Skeleton } from '@material-ui/lab';
import Navbar from "./userNavbar";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

const theme = createMuiTheme({
  typography: {
    fontFamily: '-apple-system',
  },
  palette: {
    primary: { main: "#363f4f" },
    secondary: {
      main: "#002984",
    },
  },
});


const useStyles = makeStyles((theme) => ({
  body:{
    backgroundColor: "#36454f",
    height: "100%",
    minHeight: "100vh"
  },
  root: {
    maxWidth: 300,
    flexGrow: 1,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: "#8C001A",    //red[500],
    color: "#FFFFFF"
  },
  carousel : {
    width: "50%",
    // height: "20%"
  }
}));

export default function UserPage() {
  document.title = "Swiggy";
  const classes = useStyles();
  const [getDetails, setGetDetails] = useState([]);


  let isLoggedState = useSelector((state) => state.userLogged);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem("user-token");
    try {
      const { exp } = jwtDecode(token);
      const expirationTime = exp * 1000 - 10000;
      // console.log(expirationTime)
      // console.log(Date.now())
      if (Date.now() >= expirationTime) {
        dispatch(userLogged(false));
        localStorage.removeItem("user-token");
      }
    } catch (e) {}
    if (token) dispatch(userLogged(true));
    else dispatch(userLogged(false));

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    const fetchData = () => { 
     axios
      .get("http://localhost:5000/api/restaurants/", config)
      .then((res) => {
        if (res.data.success) {
          setGetDetails(res.data.message);          
        }
      })
      .catch((err) => console.log(err));
    }
    fetchData();
  

  });


  function loggedOut() {
    dispatch(userLogged(false));
    localStorage.removeItem("user-token");
  }
  if (!isLoggedState) {
    return <Redirect to="/" />;
  }

  return (
    <div className={classes.body}>
        <Navbar
        link="/"
        authToken="user-token"
        loggedOut={loggedOut}
        disabling=""
        homeDisabling="none"
      />
      <ThemeProvider theme={theme}>
      <div align="center">
<br/>
<Carousel className={classes.carousel}>
                <div>
                    <img src={require("./chicken.jpg")} />
                    <p className="legend">Non Veg</p>
                </div>
                <div>
                    <img src={require("./veg.jpg")} />
                    <p className="legend">Pure Veg</p>
                </div>
                <div>
                    <img src={require("./icecream.jpg")} />
                    <p className="legend">Ice Creams</p>
                </div>
            </Carousel>
            <br/>
            <hr style={{color: "#FFFFFF", backgroundColor: "#FFFFFF"}}/><br/>
      <Grid container spacing={3}>
{getDetails ? getDetails.map((restaurant, key) => (
    
     restaurant.restaurantAddress ? 
  
  <Grid item xs={4} key={restaurant._id}>
   
<Link to={"/home_user/items/"+restaurant._id+"/"} style={{textDecoration: "none"}}> 
<Card className={classes.root} key={restaurant._id} style={{cursor: "pointer"}}>
      
      <CardMedia
        className={classes.media}
        image={restaurant.restaurantAddress ? `http://localhost:5000/uploads/${restaurant.restaurantAddress.profileImage}` : ""}
        // title="Paella dish"
      />
      <CardHeader
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        style={{ fontWeight: "bold" }}
        aria-label="recipe" //className={classes.avatar}
        title={restaurant.restaurantAddress ? restaurant.restaurantAddress.restaurantName : ""}
        // subheader="September 14, 2016"
      />
      <CardContent>
        <Typography style={{color: "#696969"}} variant="body2" variant="h6" component="p">
          {restaurant.restaurantAddress.restaurantDescription}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        */}
      </CardActions>
     
    </Card>
    </Link>
    </Grid>

    : null
    )) : null}
    </Grid>
    </div>
    </ThemeProvider>
    </div>
  );
}
