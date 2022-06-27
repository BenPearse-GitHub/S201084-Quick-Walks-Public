import L from "leaflet";
import goIcon from "../images/go.png";

const startMarkerIcon = new L.icon({
  iconUrl: goIcon,
  iconSize: [30, 45],
  iconAnchor: [26, 45],
  popupAnchor: [1, -34],
});

export default startMarkerIcon;
