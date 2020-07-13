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

export default function UserCart({ match }) {
  document.title = "Swiggy Cart";
  const classes = useStyles();
  const [getDetails, setGetDetails] = useState([]);
  const [getRestDetails, setGetRestDetails] = useState([]);
  const [cartItemsMsg, setCartItemsMsg] = useState("Loading...");
  const [open, setOpen] = useState(false);
  const [deleteAndUpdateCart, setDeleteAndUpdateCart] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartBTN, setCartBTN] = useState(false);
  const [deleteItem, setDeleteItem] = useState("");
  const [deleteItemInfo, setDeleteItemInfo] = useState("");
  const [deleteItemDisp, setDeleteItemDisp] = useState("none");
  const [deleteItemInfoDisp, setDeleteItemInfoDisp] = useState("none");
const [redirectToPayment, setRedirectToPayment] = useState(false);

  let isLoggedState = useSelector((state) => state.userLogged);
  let countItems1 = useSelector((state) => state.countItems);
  let grandTotal = useSelector((state) => state.total);
  const dispatch = useDispatch();

  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;

const subTotal = () => {
 let total1 = 0;

 countItems1.map((item) => (
   total1 = total1+parseInt(item.count*item.itemPrice)
 ));

 dispatch(total((total1+total1*0.07).toFixed(2)));
 return total1;
};
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
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

  const incBtn = (rid, iid) => {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    axios
      .get("http://localhost:5000/api/cart/" + rid + "/" + iid + "/add", config)
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

  const decBtn = (rid, iid) => {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };
    axios
      .get("http://localhost:5000/api/cart/" + rid + "/" + iid + "/sub", config)
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
  if(redirectToPayment){
    return <Redirect to="payments" />;
  }

  return (
    <div className={classes.body}>
      <Navbar
        link="/"
        authToken="user-token"
        loggedOut={loggedOut}
        disabling=""
        homeDisabling=""
        cartDisabling="none"
      />
      
      <ThemeProvider theme={theme}>
        
      <div> 
              <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Item Image</StyledTableCell>
            <StyledTableCell >Item Name</StyledTableCell>
            <StyledTableCell >Item Price</StyledTableCell>
            <StyledTableCell >Quantity</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {countItems1.map((item, key) => (
           
            <StyledTableRow key={item._id}>
               
              <StyledTableCell component="th" scope="row">
                <div style={{ width: 50, height: 50}}>
                <Image alt={item.itemName} src={`http://localhost:5000/uploads/${item.itemImage}`}></Image>
                </div>
              </StyledTableCell>
              <StyledTableCell style={{ color: "#000000", fontWeight: "bold", fontSize: "20px" }}>{item.itemName}</StyledTableCell>
              <StyledTableCell ><div>
                            <Button onClick={(event) => { incBtn(item.rid, item._id); handleClick(event); }}><AddIcon /></Button>
                            {/* {countItems1.map((item, key) => (
                              item._id == restaurant._id ? */}
                                <div key={item._id} style={{ fontWeight: "bold" }}>
                                  {item.count}
                                  </div>
                                {/* </div> : null */}
                            {/* ))} */}
                            <Button onClick={(event) => { decBtn(item.rid, item._id); handleClick(event) }}><RemoveIcon /></Button>
                          </div>
               </StyledTableCell>
               <StyledTableCell ><div style={{ color: "#000000", fontWeight: "bold" }}><img width="15" height="15" src="https://image.flaticon.com/icons/svg/25/25473.svg" />{item.itemPrice*item.count}
                          </div>
                          </StyledTableCell>
               </StyledTableRow>
               ))}
   <br/><br/><br/>
   {countItems1[0] == undefined ? <Alert
                variant="filled"
                severity="info"
              >
                Empty Cart
              </Alert> 
               :
   <div align="right" style={{paddingLeft: "170%"}}>
    <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2} className={classes.totalStylesNames}>Subtotal</TableCell>
            <TableCell align="right" className={classes.totalStyles}>{subTotal().toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={1} className={classes.totalStylesNames}>Tax</TableCell>
            <TableCell align="right" className={classes.totalStyles}>7%</TableCell>
            <TableCell align="right" className={classes.totalStyles}>{(subTotal()*0.07).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className={classes.totalStylesNames}>Total</TableCell>
            <TableCell align="right" className={classes.totalStyles}>{(subTotal()+subTotal()*0.07).toFixed(2)}</TableCell>
          </TableRow>
          </div>
      }
        </TableBody>
        </Table>
   
    </TableContainer>    
    
      </div>
      { countItems1[0] == undefined ? null :
     <div align="center">
      <Button
                  // fullWidth
                  align="center"
                  variant="contained"
                  color="#FFFFFF"
                  className={classes.submit}
                  style={{backgroundColor:"#fe4a49", color: "#FFFFFF"}}
                  onClick={() => {setRedirectToPayment(true)}}
                >
                  Proceed To Pay
                </Button>
                <br/><br/><br/>
                </div>
            }
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
