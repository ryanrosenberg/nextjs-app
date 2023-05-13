import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ school_markers, host_markers }) {
  const host_ids = _.map(host_markers, "school_id");
  
  const filtered_school_markers = _.filter(
    school_markers,
    function (site_marker) {
      return !host_ids.includes(site_marker.school_id);
    }
  );

  return (
    <MapContainer
      center={[
        _.filter(host_markers, (o) => o.last_active >= 2021)[0]["lat"],
        _.filter(host_markers, (o) => o.last_active >= 2021)[0]["lon"],
      ]}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {filtered_school_markers.map((marker) => {
        return (
          <CircleMarker
            center={[marker["lat"], marker["lon"]]}
            color="black"
            fillColor="#C41400"
            fillOpacity={marker.last_active >= 2021 ? 0.8 : 0.1}
            opacity={marker.last_active >= 2021 ? 1 : 0.1}
            weight={2}
          >
            <Tooltip>{marker.school_name}</Tooltip>
          </CircleMarker>
        );
      })}
      {host_markers.map((marker) => {
        return (
          <CircleMarker
            center={[marker["lat"], marker["lon"]]}
            color="black"
            fillColor="#001aff"
            fillOpacity={marker.last_active >= 2021 ? 0.8 : 0.1}
            opacity={marker.last_active >= 2021 ? 1 : 0.1}
            weight={2}
          >
            <Tooltip>{marker.site}</Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

// import { React } from "react";
// import { Map } from "pigeon-maps";
// import map_styles from "./map.module.css";

// function stamenTonerLite(x, y, z, dpr = 1) {
//   return `https://stamen-tiles.a.ssl.fastly.net/toner-lite/${z}/${x}/${y}${
//     dpr >= 2 ? "@2x" : ""
//   }.png`;
// }

// const CircleMarker = ({ left, top, style, children }) => (
//   <div
//     style={{
//       position: "absolute",
//       left: left - 15,
//       top: top - 30,
//       width: 20,
//       height: 20,
//       borderRadius: "100%",
//       border: "2px solid black",
//       background: "#265CFF",
//       ...(style || {}),
//     }}
//   >
//     {children}
//   </div>
// );

// const MarkerPopup = ({ left, top, style, children }) => (
//   <div
//     className={map_styles.markerPopup}
//     style={{
//       position: "absolute",
//       left: left,
//       top: top,
//       ...(style || {}),
//     }}
//   >
//     {children}
//   </div>
// );
// export default function MyMap({ markers }) {
//   return (
//     <Map
//       provider={stamenTonerLite}
//       dprs={[1, 2]}
//       width={800}
//       defaultCenter={[markers[0]["lat"], markers[0]["lon"]]}
//       defaultZoom={5}
//     >
//       {markers.map((marker) => {
//         return (
//           <CircleMarker anchor={[marker["lat"], marker["lon"]]}>
//             <MarkerPopup>{marker["School"]}</MarkerPopup>
//           </CircleMarker>
//         );
//       })}
//     </Map>
//   );
// }
