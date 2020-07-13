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
import { Fab, Grid } from "@material-ui/core";
import { AddCircle, Place } from "@material-ui/icons";
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
import { userLogged, countItems, total, finalLocations, delUserID } from "../components/actions";
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import leafletKnn from 'leaflet-knn';
import L from "leaflet";


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

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#36454f", //theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
  

const useStyles = makeStyles((theme) => ({
  body: {
    // backgroundColor: "#36454f",
    width: "100%",
    // height: "100%",
    // minHeight: "100vh"
  },
  submit: {
    width: "35%",
    margin: theme.spacing(3, 0, 2),
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
  table: {
    minWidth: 1000,
  },
  totalStyles : {
    fontSize: "25px",
    color: "#000000", 
    fontWeight: "bold"
  },
  totalStylesNames : {
    fontSize: "20px",
    color: "#000000", 
    fontWeight: "bold"
  }
}));

export default function UserCart({ match }) {
  document.title = "Swiggy Payments";
  const classes = useStyles();
  const [radioValue, setRadioValue] = useState('COD');
  const [delLocation, setDelLocation] = useState({});
  const [restLocation, setRestLocation] = useState({});
  const [userLocation, setUserLocation] = useState({});
const [delID, setDelID] = useState({});
const [smap, setMap] = useState(false);
const [noDelUsersDisp, setNoDelUsersDisp]  = useState("none");
const [open, setOpen] = useState(false);
const [btnDisable, setBtnDisable] = useState(false);
const [multipleOrders, setMultipleOrders] = useState(true);


  let isLoggedState = useSelector((state) => state.userLogged);
  let countItems1 = useSelector((state) => state.countItems);
  let grandTotal = useSelector((state) => state.total);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const dispatch = useDispatch();
  

  const handleChange = (event) => {
    setRadioValue(event.target.value);
  };

  const placeOrder = () => {

    if(delLocation.length != 0){
      setBtnDisable(true);
    
    var gj = L.geoJSON(delLocation)
//   var gj = L.geoJson([{
//     "type": "LineString", //Point
//     "coordinates": [
//       [15.82393084, 77.95348834]
//   ]
// },
// {
//   "type": "LineString", //Point
//   "coordinates": [
//     [25.52393084, 90.95348834]
// ]
// }]);
var nearest = leafletKnn(gj).nearest(L.latLng(restLocation.longitude, restLocation.latitude), 100);

const nearestDelUser = [];

delLocation.map((delUser) => {
 
  if(delUser.coordinates[0][0] == nearest[0].lon && delUser.coordinates[0][1] == nearest[0].lat){
    dispatch(delUserID(delUser.did));
    nearestDelUser.push(delUser);
  }
});

const allLocations = [
  [ nearest[0].lon, nearest[0].lat],  //delivery
  [ restLocation.latitude, restLocation.longitude], //restaurant
  [ userLocation.latitude, userLocation.longitude] //user

];
dispatch(finalLocations(allLocations));

// console.log(restLocation.longitude+"/rest/"+restLocation.latitude);
// console.log(nearest[0].lon+"/del/"+nearest[0].lat);
// console.log(userLocation.longitude+"/user/"+userLocation.latitude);

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

      const details = {
          items: countItems1,
          total: grandTotal,
          allLocations: allLocations,
      };
    axios.post(`http://localhost:5000/api/orderedHistory/${nearestDelUser[0].did}`, details, config)
    .then((res) => {
      setBtnDisable(false);
      handleClickOpen();
    })
    .catch((err) => console.log(err));
  }
  else{
    setNoDelUsersDisp("");
    setTimeout(() => {
      setNoDelUsersDisp("none");
    }, 5000);
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
    axios
      .get("http://localhost:5000/api/cart/", config)
      .then((res) => {
        if (res.data.success) {
          dispatch(countItems(res.data.message));
        }
      })
      .catch((err) => console.log(err));

      axios
      .get("http://localhost:5000/api/getOrders/", config)
      .then((res) => {
        if (res.data.success) {
            setMultipleOrders(res.data.message);
        }
      })
      .catch((err) => console.log(err));


      axios
      .get(`http://localhost:5000/api/restLocation/`, config)
      .then((res) => {
        if (res.data.success) {   
          setRestLocation(res.data.message);
        }
      })
      .catch((err) => console.log(err));

      axios
      .get(`http://localhost:5000/api/userLocation/`, config)
      .then((res) => {
        if (res.data.success) {   
          setUserLocation(res.data.message);
        }
      })
      .catch((err) => console.log(err));

      axios
      .get("http://localhost:5000/api/delLocation/", config)
      .then((res) => {
        if (res.data.success) {
          let data = [];
          res.data.message.map((user) => {
            data.push({
              
                "type": "LineString", //Point
                did: user._id,
                "coordinates": [
                  [user.location[user.location.length-1].latitude, user.location[user.location.length-1].longitude]
              ]
            })
          })
          
          setDelLocation(data);
        }

      })
      .catch((err) => console.log(err));
  }, []);

  
if(smap){
return <Redirect to="/live_tracking"/>
}

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
    
    
    <Alert
                variant="filled"
                severity="error"
                style={{ display: noDelUsersDisp }}
              >
                All Delivery Users are Busy, Please try after sometime.
              </Alert> 
             {multipleOrders ? null : <Alert
                variant="filled"
                severity="warning"
              >
                Another order in Progress
              </Alert> 
              }
    <div align="center">
      <Typography style={{fontWeight: "bold", fontSize: "30px"}}>Payments :</Typography><br/><br/>
  <Typography style={{fontWeight: "bold", fontSize: "20px"}}>To Pay: <img width="15" height="15" src="https://image.flaticon.com/icons/svg/25/25473.svg" />{grandTotal}</Typography>

    </div>
    <div style={{margin: 50}}>
    <FormControl component="fieldset">
      <FormLabel component="legend">Payment Options :</FormLabel>
      <RadioGroup aria-label="payments" name="payment" value={radioValue} onChange={handleChange}>
        <FormControlLabel value="COD" control={<Radio />} label="COD" style={{fontWeight: "bold"}}/>
        <FormControlLabel value="UPI" disabled control={<Radio />} label="UPI" style={{fontWeight: "bold"}} />
      </RadioGroup>
    </FormControl>
    </div>
    <div align="center">
      {multipleOrders ? 
    <Button
                  // fullWidth
                  align="center"
                  variant="contained"
                  color="#FFFFFF"
                  className={classes.submit}
                  style={{backgroundColor:"#fe4a49", color: "#FFFFFF"}}
                  onClick={() => {placeOrder()}}
                  disabled={btnDisable}
                >
                  Confirm Order
                </Button>
                : null }
                {/* <Button onClick={() => setMap(true)}>map</Button> */}
                </div>

                <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{color: "#000000"}}>
            Order is confirmed, you can now track your order.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
