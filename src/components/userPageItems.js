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
import { userLogged, countItems } from "../components/actions";
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
import { compose } from "redux";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Popover } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';

const theme = createMuiTheme({
  typography: {
    fontFamily: '-apple-system',
  },
  palette: {
    primary: { main: "#363f4f" },
    secondary: {
      main: "#fe4a49",
    },
  },
});


const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: "#36454f",
    width: "100%",
    // height: "100%",
    // minHeight: "100vh"
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
    // fontFamily: '-apple-system',
    // 'BlinkMacSystemFont',
    // '"Segoe UI"',
    // 'Roboto',
    // '"Helvetica Neue"',
    // 'Arial',
    // 'sans-serif',
    // '"Apple Color Emoji"',
    // '"Segoe UI Emoji"',
    // '"Segoe UI Symbol"',
    backgroundColor: "#66023c",    //red[500],
    color: "#FFFFFF"
  },
}));

export default function UserPageItems({ match }) {
  document.title = "Swiggy";
  const classes = useStyles();
  const [getDetails, setGetDetails] = useState([]);
  const [getRestDetails, setGetRestDetails] = useState([]);
  const [cartItemsMsg, setCartItemsMsg] = useState("Loading...");
  const [open, setOpen] = useState(false);
  const [deleteAndUpdateCart, setDeleteAndUpdateCart] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartBTN, setCartBTN] = useState(false);
  const [switchBtn, setSwitchBtn] = useState(false);


  let isLoggedState = useSelector((state) => state.userLogged);
  let countItems1 = useSelector((state) => state.countItems);
  const dispatch = useDispatch();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (event) => {
    setSwitchBtn(event.target.checked);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;


  const handleClose = () => {
    setOpen(false);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const onlyVeg = (checked) => {
    
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };
if(checked){
    axios
      .get("http://localhost:5000/api/restaurants/" + match.params.id, config)
      .then((res) => {

        if (res.data.success) {
         let vegItems = res.data.message.map((item) => (
            item.veg ? item : null
         ));
          console.log(vegItems)
          setGetDetails(vegItems);
        }
      })
      .catch((err) => console.log(err));
    }
    else{
      axios
      .get("http://localhost:5000/api/restaurants/" + match.params.id, config)
      .then((res) => {

        if (res.data.success) {
          setGetDetails(res.data.message);
        }
      })
      .catch((err) => console.log(err));
    }
  };


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
    // const fetchData = () => { 
    axios
      .get("http://localhost:5000/api/restaurants/" + match.params.id, config)
      .then((res) => {

        if (res.data.success) {
          console.log(res.data.message)
          setGetDetails(res.data.message);
        }
      })
      .catch((err) => console.log(err));
    //   // }
    //   // fetchData();

    // // const fetchData1 = async() => { 
    axios
      .get("http://localhost:5000/api/restaurant/" + match.params.id, config)
      .then((res) => {

        if (res.data.success) {
          console.log(res.data.message)
          setGetRestDetails(res.data.message);
        }
      })
      .catch((err) => console.log(err));
    // //   }
    // //   fetchData1();

    // //   const cartItemNumber = () => { 
    axios
      .get("http://localhost:5000/api/cart/", config)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.message)
          // setCartItemsNumber(res.data.message);     
          console.log(res.data.message) 
          dispatch(countItems(res.data.message));
        }
      })
      .catch((err) => console.log(err));
    //     }
    //     cartItemNumber();

  }, []);

  const getCartData = () => {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    axios
      .get("http://localhost:5000/api/cart/", config)
      .then((res) => {
        if (res.data.success) {
          dispatch(countItems(res.data.message));
        }
      })
      .catch((err) => console.log(err));

  }

  const incBtn = (iid) => {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    axios
      .get("http://localhost:5000/api/cart/" + match.params.id + "/" + iid + "/add", config)
      .then((res) => {
        if (res.data.success) {
          getCartData();
          setCartItemsMsg(res.data.message);
          setTimeout(() => {
            setCartItemsMsg("Loading...");
            setAnchorEl(null);
          }, 2000);
        }
        if (!res.data.success && res.data.dialog) {
          setAnchorEl(null);
          setDeleteAndUpdateCart({
            message: res.data.message,
            uid: res.data.uid,
            id: res.data.id,
          });
          handleClickOpen();

        }
        if (!res.data.success && !res.data.dialog) {
          setCartItemsMsg(res.data.message);
          setTimeout(() => {
            setCartItemsMsg("Loading...");
            setAnchorEl(null);
          }, 2000);
        }
      })
      .catch((err) => console.log(err));
  };

  const decBtn = (iid) => {
    console.log(iid)

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };
    axios
      .get("http://localhost:5000/api/cart/" + match.params.id + "/" + iid + "/sub", config)
      .then((res) => {
        console.log(res.data)
        if (res.data.success) {
          getCartData();
          setCartItemsMsg(res.data.message);
          setTimeout(() => {
            setCartItemsMsg("Loading...");
            setAnchorEl(null);
          }, 2000);
        }
        if (!res.data.success) {
          setCartItemsMsg(res.data.message);
          setTimeout(() => {
            setCartItemsMsg("Loading...");
            setAnchorEl(null);
          }, 2000);
        }
      })
      .catch((err) => console.log(err));

  }

  function deleteOnClick() {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    axios.get(`http://localhost:5000/api/cart/${deleteAndUpdateCart.uid}/${deleteAndUpdateCart.id}`, config)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.message)
          getCartData();
        }
      })
      .catch((err) => console.log(err));
  };

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
        homeDisabling=""
      />
      <ThemeProvider theme={theme}>
        <div align="center">
          <div>
            <Typography variant="body2" variant="h2" style={{ color: "#FFFFFF" }} component="p">
              {getRestDetails.restaurantName}
            </Typography><br />
            <Typography variant="body2" variant="h6" style={{ color: "#FFFFFF" }} component="p">
              {getRestDetails.restaurantDescription}
            </Typography>
            <br />
            <Typography style={{color:"#fe4a49", fontWeight: "bold"}}>VEG ONLY</Typography> <nbsp/><nbsp/><nbsp/><nbsp/>
            
            <Switch
        checked={switchBtn}
        onChange={handleChange}
        onClick={(event) => onlyVeg(event.target.checked)}
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
        color="secondary"
      />
            <br />
            <hr style={{ color: "#FFFFFF", backgroundColor: "#FFFFFF" }} /><br />
          </div>

          <Grid container spacing={3}>

            {getDetails ? getDetails.map((restaurant) => (

              restaurant ?

                <Grid item xs={4} key={restaurant._id} className={classes.typography}>

                  <Card className={classes.root}>

                    <CardMedia
                      className={classes.media}
                      image={restaurant.itemImage ? `http://localhost:5000/uploads/${restaurant.itemImage}` : ""}
                    // title="Paella dish"
                    />
                    {restaurant.veg ? 
                    <img width= "15" height= "15" src={require("./veg-icon.png")}></img>
                    : <img width= "15" height= "15" src={require("./non-veg-icon.png")}></img>}
                    <CardHeader
                      // action={
                      //   <IconButton aria-label="settings">
                      //     <MoreVertIcon />
                      //   </IconButton>
                      // }
                      style={{ fontWeight: "bold" }}
                      aria-label="recipe" //className={classes.avatar}
                      title={restaurant.itemName ? restaurant.itemName : ""}
                    // subheader="September 14, 2016"
                    >
                    </CardHeader>
                    <CardContent>
                      <Typography style={{ color: "#696969" }} variant="body2" variant="h6" component="p">
                        {restaurant.itemDescription}
                      </Typography><br />
                      <Grid container>
                        <Grid item xs align="left" style={{ align: "left" }}>
                          <div style={{ color: "#000000", fontWeight: "bold" }}><img width="15" height="15" src="https://image.flaticon.com/icons/svg/25/25473.svg" />{restaurant.itemPrice}
                          </div>
                        </Grid>
                        <Grid item>
                          <div>
                            <Button onClick={(event) => { incBtn(restaurant._id); handleClick(event); }}><AddIcon /></Button>
                            {countItems1.map((item, key) => (
                              item._id == restaurant._id ?
                                <div key={item._id} style={{ fontWeight: "bold" }}>
                                  {item.count}
                                </div> : null
                            ))}
                            <Button onClick={(event) => { decBtn(restaurant._id); handleClick(event) }}><RemoveIcon /></Button>
                          </div>

                        </Grid>
                      </Grid>
                    </CardContent>
                    {/* <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
       

        
      </CardActions>
       */}

                  </Card>
                </Grid>

                : null
            )) : null}
          </Grid>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" style={{ color: "#000000" }}>
              {deleteAndUpdateCart.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
          </Button>
            <Button onClick={() => { deleteOnClick(); setOpen(false); }} color="primary" autoFocus>
              Yes
          </Button>
          </DialogActions>
        </Dialog>
        <Popover
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography className={classes.typography}>{cartItemsMsg}</Typography>
        </Popover>
      </ThemeProvider>
    </div>
  );
}
