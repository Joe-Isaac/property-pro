import { View, Text } from "react-native";
import MapView,{Marker} from 'react-native-maps'

import React, {useState} from "react";

const Map = ({coordinates}) => {
  return (
      <View
        style={{
          height: 400,
          width: 400
        }}
      >
        {coordinates && (
          <MapView
            style={{
              flex: 1,
            }}
            //specify our coordinates.
            initialRegion={{
              latitude: coordinates.coords.latitude,
              longitude: coordinates.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0,
            }}
          >
            <Marker
              coordinate={{
                latitude: coordinates.coords.latitude,
                longitude: coordinates.coords.longitude,
              }}
              title="Origin"
              description={"My Location"}
              identifier="origin"
            />
          </MapView>
        )}
      </View>
  );
};

export default Map;