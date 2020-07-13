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

const validationSchema = Yup.object({
    phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number is not valid")
    .required(),
    address: Yup.string().min(6).required(),
  landmark: Yup.string().min(6).required(),
});

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

export default function RestDetails() {
  document.title = "Address";
  // const history = useHistory();
  const classes = useStyles();
  const [dataError, setDataError] = useState("");
  const [image, setImage] = useState("");
  const [imageDetails, setImageDetails] = useState("");
  const [errorDisp, setErrorDisp] = useState("none");
  const [successDisp, setSuccessDisp] = useState("none");
  const [dataSuccess, setDataSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [getDetails, setGetDetails] = useState({});
const [imageSubmit, setImageSubmit] = useState(false);

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
    const fetchData = async() => { 
    await axios
      .get("http://localhost:5000/api/address/", config)
      .then((res) => {
        if (res.data.success) {
          setGetDetails(res.data.message);
        }
      })
      .catch((err) => console.log(err));

      await axios
      .get("http://localhost:5000/api/image/", config)
      .then((res) => {
        if (res.data.success) {
          setImageDetails(res.data.message);
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

  function onchangeImage(e) {
    setSelectedFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0])); 
    setImageSubmit(true);
  }

if(imageSubmit){
    const formData = new FormData();
    formData.append("profileImage", selectedFile);
    
    const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      };
       axios
        .post("http://localhost:5000/api/image/", formData, config)
        .then((res) => {
            setDataError("");
          setErrorDisp("none");
          setSuccessDisp("");
          setDataSuccess(res.data.message);
          setTimeout(() => {
            setSuccessDisp("none");
          }, 5000);
        })     
        setImageSubmit(false);
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
        disabling="none"
      />

      <Formik
        initialValues={{
          phone: getDetails.phone ? getDetails.phone : "",
          address: getDetails.address ? getDetails.address : "",
          landmark: getDetails.landmark ? getDetails.landmark : "",
        }}
        enableReinitialize="true"
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
         

            const formData = {
                    phone: values.phone,
                    address: values.address,
                    landmark: values.landmark
            };

            const config = {
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("user-token"),
              },
            };

            axios
              .post(
                "http://localhost:5000/api/address/",
                formData,
                config
              )
              .then((res) => {
                if (!res.data.success) {
                  setDataSuccess("");
                  setSuccessDisp("none");
                  setErrorDisp("");
                  setDataError(res.data.message);
                  setTimeout(() => {
                    setErrorDisp("none");
                  }, 10000);
                }
                if (res.data.success) {
                  setDataError("");
                  setErrorDisp("none");
                  setSuccessDisp("");
                  setDataSuccess(res.data.message);
                  setTimeout(() => {
                    setSuccessDisp("none");
                  }, 5000);
                }
              })
              .catch((err) => console.log(err));
          }
        }
      >
        {({
          handleSubmit,
          handleChange,
          values,
          errors,
          isSubmitting,
          handleBlur,
          touched,
        }) => (
          <ThemeProvider theme={theme}>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5" align="center">
                 Address
                <hr
                  style={{
                    backgroundColor: "black",
                    height: 1,
                    width: 600,
                  }}
                />
              </Typography>
              <Alert
                variant="filled"
                severity="error"
                style={{ display: errorDisp }}
              >
                {dataError}
              </Alert>

              <Alert
                variant="filled"
                severity="success"
                style={{ display: successDisp }}
              >
                {dataSuccess}
              </Alert>
              <form className={classes.form} onSubmit={handleSubmit}>
                <div align="center">
                  <label htmlFor="profileImage">
                    <input
                      style={{ display: "none" }}
                      accept="image/x-png,image/jpeg"
                      id="profileImage"
                      type="file"
                      onChange={onchangeImage}
                    //   onClick={imageSubmit}
                      //   required
                    />
                    <Fab
                      color="primary"
                      size="small"
                      component="span"
                      aria-label="add"
                      variant="extended"
                    >
                      Profile Image
                      <AddCircle />
                    </Fab>
                  </label>
                  <br />
                  <br />
                  {/* <div style={{ width: 150, height: 150, display: disp }}>
                        <Image disableSpinner={true} src={image} />
                      </div> */}
                  <Avatar src={image ? image : `http://localhost:5000/uploads/${imageDetails}`} />
                  {/* <Button type="submit"
                  variant="contained"
                  className={classes.submit} onClick={imageSubmit} color="primary">save</Button> */}
                </div>
            
                <Grid
                  container
                  directio="column"
                  justify="center"
                  alignItems="center"
                  spacing={6}
                >
                  <Grid item xs={6}>
                    <TextField
                      // variant="outlined"
                      margin="normal"
                      // required
                      fullWidth
                      name="phone"
                      label="Phone"
                      type="text"
                      id="phone"
                      autoComplete="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div>
                      <Error touched={touched.phone} message={errors.phone} />
                    </div>
                    <TextField
                      // variant="outlined"
                      margin="normal"
                      // required
                      fullWidth
                      name="address"
                      label="Address"
                      type="text"
                      id="address"
                      autoComplete="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div>
                      <Error
                        touched={touched.address}
                        message={errors.address}
                      />
                    </div>
                    <TextField
                      // variant="outlined"
                      margin="normal"
                      // required
                      fullWidth
                      name="landmark"
                      label="landmark"
                      type="type"
                      id="landmark"
                      autoComplete="landmark"
                      value={values.landmark}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div>
                      <Error
                        touched={touched.landmark}
                        message={errors.landmark}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  //   disabled={isSubmitting}
                >
                  Save Address
                </Button>
              </form>
            </div>
          </ThemeProvider>
        )}
      </Formik>
    </div>
  );
}
