import React from 'react';
import { Map, Marker } from 'pigeon-maps';

const MapComponent = ({ lat, lng }) => {
  return (
    <Map center={[lat, lng]} zoom={12} height={300} width={400}>
      <Marker width={50} anchor={[lat, lng]} />
    </Map>
  );
};

export default MapComponent;
