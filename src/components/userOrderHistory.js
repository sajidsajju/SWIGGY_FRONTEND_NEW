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
import { userLogged, countItems, total } from "../components/actions";
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
    backgroundColor: "#36454f",
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
  },
  emptyCart: {
    fontSize : "20px",
    fontWeight: "bold",
    align: "center",

  }
}));

export default function UserOrderHistory({ match }) {
  document.title = "Swiggy Cart";
  const classes = useStyles();
  const [getOrderDetails, setGetOrderDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemID, setItemID] = useState("");
  const [cancelOrderAlert, setCancelOrderAlert] = useState(false);

  let isLoggedState = useSelector((state) => state.userLogged);
  const dispatch = useDispatch();


  const cancelOrder = (id) => {
    setOpen(true);
    setItemID(id);
  }
  const handleClose = () => {
    setOpen(false);
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
    
const orders = async () => {
    await axios
    .get("http://localhost:5000/api/getAllOrders/", config)
    .then((res) => {
  
      if (res.data.success) {
        setGetOrderDetails(res.data.message);
      }
    })
    .catch((err) => console.log(err));

  };
  orders();
  }, []);

  const getAllOrders = async () => {
    const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      };
    await axios
    .get("http://localhost:5000/api/getAllOrders/", config)
    .then((res) => {
  
      if (res.data.success) {
        setGetOrderDetails(res.data.message);
        setCancelOrderAlert(false);
      }
    })
    .catch((err) => console.log(err));
  };

  
  function cancelOrderStatus() {
    const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      };
      
    axios
      .get(`http://localhost:5000/api/cancelOrder/${itemID}`, config)
      .then((res) => {
        if (res.data.success) {
            console.log(res.data.message)
          setCancelOrderAlert(true);
          setTimeout(() => {
            getAllOrders();
          }, 3000);
          
          
        }
      })
      .catch((err) => console.log(err));
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
        cartDisabling=""
        ordersDisabling="none"
      />
      
      <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Order ID</StyledTableCell>
                      <StyledTableCell align="left"> Order Details</StyledTableCell>
                      <StyledTableCell align="left">Status</StyledTableCell>
                      <StyledTableCell align="left">Cancel</StyledTableCell>
                     
                    </TableRow>
                  </TableHead>
                  {cancelOrderAlert ? <Alert
                variant="filled"
                severity="info"
              >
                 Order Cancelled 
              </Alert> : null }
         {getOrderDetails ? getOrderDetails.map((order) => (
           <TableBody>
               <StyledTableRow key={order._id}>
             
            <StyledTableCell >{order.TransID}</StyledTableCell>
            <StyledTableCell ><Link to={"/order_details/"+order._id} style={{ textDecoration: "none" }}>Click here for order details</Link>  </StyledTableCell>
             <StyledTableCell >{order.status}
           </StyledTableCell>
           <StyledTableCell ><div>{order.completed ? <div>Closed</div>  : <Button style={{color: "#D8000C", backgroundColor: "#FFD2D2"}} className="deleteBtn" onClick={() => { cancelOrder(order.TransID); }}>
             Cancel Order
            </Button>  }
            </div>
            </StyledTableCell>
            
            </StyledTableRow> 
          
        </TableBody>
          )) : 
         <div></div>         
         } 
          
          </Table>
          </TableContainer>

          <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description" style={{ color: "#000000" }}>
                              Are you sure to CANCEL the order ?
          </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose} color="primary">
                              No
          </Button>
                            <Button onClick={() => { cancelOrderStatus(); setOpen(false); }} color="primary" autoFocus>
                              Yes
          </Button>
                          </DialogActions>
                        </Dialog>

          </div>
  );
}
