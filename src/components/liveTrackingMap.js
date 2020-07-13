import React, { useState, useEffect, useRef } from "react";
import { Map, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import L from "leaflet";
import "./maps.css";
import Button from "@material-ui/core/Button";
// import useGeolocation from "react-hook-geolocation";
import { usePosition } from "./Map";
import axios from "axios";
import { Redirect } from "react-router-dom";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import MyLocationIcon from '@material-ui/icons/MyLocation';
import {  Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import { userLogged, delUserID , finalLocations} from "../components/actions";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Routing from "./RoutingMachine";
import { LocationOff } from "@material-ui/icons";

const myIcon = L.icon({
  iconUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII",
  iconSize: [25, 41],
  iconAnchor: [12.5, 43],
  popupAnchor: [0, -41],
});
const myRestIcon = L.icon({
  iconUrl: "https://www.flaticon.com/premium-icon/icons/svg/3009/3009489.svg",
  iconSize: [25, 41],
  iconAnchor: [12.5, 43],
  popupAnchor: [0, -41],
});

const myDelIcon = L.icon({
  iconUrl: "https://image.flaticon.com/icons/svg/3027/3027212.svg",
  iconSize: [25, 41],
  iconAnchor: [12.5, 43],
  popupAnchor: [0, -41],
});

const theme = createMuiTheme({
  palette: {
    primary: { main: "#000000" },
    secondary: {
      main: "#002984",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#33A1DE",
  },
}));
function MyMarkersList({markers}){
    const items = markers.map((data, idx) =>(
        <Marker key={`marker-${idx}`} position={data.position} icon={myIcon}>
    <Popup>{data.content}</Popup>
    </Marker>
    ))
return items;
}

function LiveTrackingMaps() {
  document.title = "Trace Order";
  const classes = useStyles();
  const [location, setLocation] = useState([15.8281, 78.0373]);
  const [delId1, setDelId] = useState("");
  const [back, setBack] = useState(false);
  const [open, setOpen] = useState(false);
  const map = useRef(null);
// const [markers, setMarkers] = useState([
//     {key: 'marker1', position: [15.823930846491564, 77.95348834366095], content: '1'},
//     {key: 'marker2', position: [19.1281, 80.9373], content: '2'},
//     {key: 'marker3', position: [15.8281, 78.0373], content: '3'}
// ]);

  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  
  let isLoggedState = useSelector((state) => state.userLogged);
  let locations = useSelector((state) => state.finalLocations);
  let delId = useSelector((state) => state.delUserID);


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
    } catch (e) {}
    if (token) dispatch(userLogged(true));
    else dispatch(userLogged(false));

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };
    
    axios
    .get("http://localhost:5000/api/allLocations", config)
    .then((res) => {
      if (res.data.success) {
        dispatch(finalLocations(res.data.message));
      }
    })
    .catch((err) => console.log(err));

  },[]);

//   var locations= [
//     [15.823930846491564, 77.95348834366095],
//     [15.8281, 78.0373],
//     [15.8311607, 78.0508502]
//   ];


const getParticularLocation = () => {
  console.log(delId1)
const config = {
  headers: {
    "content-type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("user-token"),
  },
};
axios
.get("http://localhost:5000/api/allLocations", config)
.then((res) => {
  if (res.data.success) {
    dispatch(finalLocations(res.data.message));
  }
})
.catch((err) => console.log(err));
  }
  setTimeout(() => {
    getParticularLocation();
    
  }, 30000);

  if(back){
    return <Redirect to="/"/>
  }
  if (!isLoggedState) {
    return <Redirect to="/" />;
  }
  return (
    <div>
     
      <div className="mapdiv">
        {/* <h1 className="location">MAP</h1> */}
        <ThemeProvider theme={theme}>
          <Grid container
          direction="row"
           justify="center"
           alignItems="center"
            spacing={6} className="location">
              <Grid item xs={6}>
              <Button className={classes.submit} color="primary" onClick={() => {setBack(true)}}>
                  Back
                </Button>
              </Grid>
          </Grid>
        </ThemeProvider>
        <Map className="map" center={location} zoom={10} ref={map}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
            
            <Marker key={1} position={locations[0]} icon={myDelIcon}><Popup>Delivery</Popup></Marker>
            <Marker key={2} position={locations[1]} icon={myRestIcon}><Popup>Restaurant</Popup></Marker>
            <Marker key={3} position={locations[2]} icon={myIcon}><Popup>Home</Popup></Marker>
            {/* <Polyline key={4} positions={[locations[0], locations[1]]}/>
            <Polyline ley={5} positions={[locations[1], locations[2]]} /> */}

            <Routing color="#000000" map={map} road={locations} />
        </Map>
      </div>
    
    </div>
  );
}
export default LiveTrackingMaps;
