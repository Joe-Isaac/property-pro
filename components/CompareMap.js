import { View, Text } from "react-native";
import MapView,{Marker} from 'react-native-maps'

import React, {useState} from "react";
import tw from "tailwind-react-native-classnames";

const CompareMap = ({initialCoordinates, finalCoordinates}) => {
  return (
      <View
        style={{
          height: 400,
          width: 400
        }}
      >
        {(initialCoordinates && finalCoordinates) && (
          <MapView
            style={{
              flex: 1,
            }}
            //specify our coordinates.
            initialRegion={{
              latitude: finalCoordinates.coords.latitude,
              longitude: finalCoordinates.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0,
            }}
          >
            <Marker
              coordinate={{
                latitude: initialCoordinates.coords.latitude,
                longitude: initialCoordinates.coords.longitude,
              }}
              pinColor="red"
              title="Origin"
              description={"Origin Coordinates"}
              identifier="origin"
            />

            <Marker
            pinColor="purple"
            coordinate={{
                latitude: finalCoordinates.coords.latitude,
                longitude: finalCoordinates.coords.longitude,
              }}
              title="Final Coordinates"
              description={"Final Coordinates"}
              identifier="final"
              />
          </MapView>
        )}
      </View>
  );
};

export default CompareMap;