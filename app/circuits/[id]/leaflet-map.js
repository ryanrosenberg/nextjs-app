'use client'

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import _ from "lodash";

export default function Map({ school_markers, host_markers }) {
  const host_ids = _.map(_.filter(host_markers, (o) => o.last_host >= 2023), "school_id");
  
  const filtered_school_markers = _.filter(
    school_markers,
    function (site_marker) {
      return !host_ids.includes(site_marker.school_id);
    }
  );
  
  return (
    <MapContainer
      center={[
        _.filter(host_markers, (o) => o.last_host >= 2023)[0]["lat"],
        _.filter(host_markers, (o) => o.last_host >= 2023)[0]["lon"],
      ]}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>
        &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a>
        &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>
        &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>'
      />
      {filtered_school_markers.map((marker, k) => {
        return (
          <CircleMarker
            key = {k}
            center={[marker["lat"], marker["lon"]]}
            color="black"
            fillColor="#C41400"
            fillOpacity={marker.last_active >= 2023 ? 0.8 : 0.1}
            opacity={marker.last_active >= 2023 ? 1 : 0.1}
            weight={2}
          >
            <Tooltip>{marker.school}</Tooltip>
          </CircleMarker>
        );
      })}
      {_.filter(host_markers, (o) => o.last_host >= 2023).map((marker) => {
        return (
          <CircleMarker
            center={[marker["lat"], marker["lon"]]}
            color="black"
            fillColor="#001aff"
            fillOpacity={marker.last_host >= 2023 ? 0.8 : 0.1}
            opacity={marker.last_host >= 2023 ? 1 : 0.1}
            weight={2}
          >
            <Tooltip>{marker.site}</Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}