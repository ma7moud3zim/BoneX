import React from 'react';
import { Map, Marker } from 'pigeon-maps';

const MapComponent = ({ lat, lng }) => {
  if(lat)console.log(lat);
  if(lng)console.log(lng);
  return (
    <Map center={[lat, lng]} zoom={15} height={300} width={400}>
      <Marker width={50} anchor={[lat, lng]} />
    </Map>
  );
};

export default MapComponent;
