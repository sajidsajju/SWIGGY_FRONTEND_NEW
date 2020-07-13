import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Navbar from "./delNavbar";
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
import { delLogged } from "../components/actions";
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

const theme = createMuiTheme({
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
  table: {
    minWidth: 1000,
  },
}));

export default function DeliveryPage() {
  document.title = "Delivery";
  // const history = useHistory();
  const classes = useStyles();
  const [dataError, setDataError] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [errorDisp, setErrorDisp] = useState("none");
  const [successDisp, setSuccessDisp] = useState("none");
  const [dataSuccess, setDataSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [getDetails, setGetDetails] = useState([]);
  const [disp, setDisp] = useState("none");
  const [itemOrderPage, setItemOrderPage] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [deleteItem, setDeleteItem] = useState("");
  const [deleteItemInfo, setDeleteItemInfo] = useState("");
  const [deleteItemDisp, setDeleteItemDisp] = useState("none");
  const [deleteItemInfoDisp, setDeleteItemInfoDisp] = useState("none");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [deleteID, setDeleteID] = useState("");
  const [itemID, setItemID] = useState("");
  const [mapPage, setMapPage] = useState(false);
  const [addressPage, setAddressPage] = useState(false);
  const [getOrderDetails, setGetOrderDetails] = useState([]);
const [deliverOrderAlert, setDeliverOrderAlert] = useState(false);
const [cancelOrderAlert, setCancelOrderAlert] = useState(false);

  const handleClickOpen = (id) => {
    setOpen(true);
    setDeleteID(id);
  };
  const deliverOrder = (id) => {
    setOpen(true);
    setItemID(id);
  }

  const cancelOrder = (id) => {
    setOpen1(true);
    setItemID(id);
  }
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleClose1 = () => {
    setOpen1(false);
  };
 
  let isLoggedState = useSelector((state) => state.delLogged);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("del-token");
    try {
      const { exp } = jwtDecode(token);
      const expirationTime = exp * 1000 - 10000;
      // console.log(expirationTime)
      // console.log(Date.now())
      if (Date.now() >= expirationTime) {
        dispatch(delLogged(false));
        localStorage.removeItem("del-token");
      }
    } catch (e) { }
    if (token) dispatch(delLogged(true));
    else dispatch(delLogged(false));


    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("del-token"),
      },
    };

   
    const fetchMapData = async () => {
      await axios
        .get("http://localhost:5000/api/location/", config)
        .then((res) => {

          if (!res.data.success) {
            setMapPage(true);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchMapData();

const getAllOrders = async () => {
  await axios
  .get("http://localhost:5000/api/getAllOrders/", config)
  .then((res) => {

    if (res.data.success) {
      setGetOrderDetails(res.data.message);
    }
  })
  .catch((err) => console.log(err));
};
getAllOrders();

   
  }, []);

  const getAllOrders = async () => {
    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("del-token"),
      },
    };
    await axios
    .get("http://localhost:5000/api/getAllOrders/", config)
    .then((res) => {
  
      if (res.data.success) {
        setGetOrderDetails(res.data.message);
        setDeliverOrderAlert(false);
        setCancelOrderAlert(false);
      }
    })
    .catch((err) => console.log(err));
  };
  const currentPage = getDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

 
  function changeOrderCompleted() {
    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("del-token"),
      },
    };
    axios
      .get(`http://localhost:5000/api/changeOrderStatus/${itemID}`, config)
      .then((res) => {
        if (res.data.success) {
            setDeliverOrderAlert(true);
          setTimeout(() => {
            getAllOrders();
        }, 3000);
          
        }
      })
      .catch((err) => console.log(err));
  }

  function cancelOrderStatus() {
    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("del-token"),
      },
    };
    axios
      .get(`http://localhost:5000/api/cancelOrder/${itemID}`, config)
      .then((res) => {
        if (res.data.success) {
          setCancelOrderAlert(true);
          setTimeout(() => {
            getAllOrders();
          }, 3000);
          
          
        }
      })
      .catch((err) => console.log(err));
  }


  function loggedOut() {
    dispatch(delLogged(false));
    localStorage.removeItem("del-token");
  }

  if (!isLoggedState) {
    return <Redirect to="/deliveryLogin" />;
  }
  if (mapPage) {
    return <Redirect to="/map" />
  }
  if (addressPage) {
    return <Redirect to="/delivery_address" />
  }

  return (
    <div>
      <Navbar
        link="/deliveryLogin"
        authToken="del-token"
        loggedOut={loggedOut}
        disabling=""
        homeDisabling="none"
      />    
      </div>    
      );
}
