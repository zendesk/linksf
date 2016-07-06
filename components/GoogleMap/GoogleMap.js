import React, { PropTypes } from 'react'

import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps'

const markers = [{
  position: {
    lat: 37.774,
    lng: -122.4194,
  },
  key: 'Taiwan',
  defaultAnimation: 2,
}]

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
          defaultCenter={{ lat: 37.774, lng: -122.4194 }}
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
          {markers.map((marker, index) => {
            return (
              <Marker
                {...marker}
                onRightclick={() => props.onMarkerRightclick(index)} />
            )
          })}
        </GoogleMap>
      }
    />
  )
}

export default MyGoogleMap
