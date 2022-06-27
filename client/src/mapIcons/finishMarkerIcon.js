import L from "leaflet";
import flagIcon from "../images/flag.png";

const finishMarkerIcon = new L.icon({
  iconUrl: flagIcon,
  iconSize: [50, 45],
  iconAnchor: [0, 45],
  popupAnchor: [1, -34],
});

export default finishMarkerIcon;
