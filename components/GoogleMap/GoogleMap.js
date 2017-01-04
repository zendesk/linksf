import React, { PropTypes } from 'react'

import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps'

const MyGoogleMap = (props) => {
  return (
    <GoogleMapLoader
      containerElement={
        <div
          style={{
            height: '100%',
          }}
        />
      }
      googleMapElement={
        <GoogleMap
          defaultCenter={{ lat: props.lat, lng: props.long }}
          options={{
            zoom:              15,
            mapTypeControl:    false,
            scrollwheel:       false,
            navigationControl: false,
            draggable:         false,
            streetViewControl: false,
            zoomControl:       false
          }}
        >
        <Marker
          position={{ lat: props.lat, lng: props.long }}
          defaultAnimation={2}
         />
        </GoogleMap>
      }
    />
  )
}

export default MyGoogleMap
