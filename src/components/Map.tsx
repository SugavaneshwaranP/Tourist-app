import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  id?: string;
  description?: string;
}

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  height?: string;
  apiKey: string;
}

const Map: React.FC<MapProps> = ({
  center,
  zoom,
  markers,
  onMarkerClick,
  height = '400px',
  apiKey
}) => {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={{ width: '100%', height }}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            onClick={() => onMarkerClick && onMarkerClick(marker)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
export type { MapMarker };
