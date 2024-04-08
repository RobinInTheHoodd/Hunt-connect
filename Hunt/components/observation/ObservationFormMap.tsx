import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from "react-native-maps";
import ObservationFormDuckPosition from "../../model/observation/ObservationFormDuckPosition";
import { mapJSON } from "./modal/ObservationFormModalMap";

const initialRegion = {
  latitude: 50.69693758264165,
  longitude: -59.87274991348386,
  latitudeDelta: 0.006700103798038981,
  longitudeDelta: 0.01000028103589301,
};

interface IObservationFormMapProps {
  form: any;
}

export default function ObservationFormMap({ form }: IObservationFormMapProps) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(initialRegion);

  const onRegionChangeComplete = (newRegion: any) => {
    if (
      newRegion.latitudeDelta > initialRegion.latitudeDelta ||
      newRegion.longitudeDelta > initialRegion.longitudeDelta
    ) {
      mapRef.current?.animateToRegion(initialRegion, 200);
    }
  };

  const setBoundaries = () => {
    const northEast = {
      latitude: initialRegion.latitude + initialRegion.latitudeDelta / 2,
      longitude: initialRegion.longitude + initialRegion.longitudeDelta / 2,
    };

    const southWest = {
      latitude: initialRegion.latitude - initialRegion.latitudeDelta / 2,
      longitude: initialRegion.longitude - initialRegion.longitudeDelta / 2,
    };
    if (mapRef.current) {
      mapRef.current.setMapBoundaries(northEast, southWest);
    }
  };

  return (
    <MapView
      ref={mapRef}
      region={region}
      onRegionChangeComplete={onRegionChangeComplete}
      scrollEnabled={true}
      zoomEnabled={true}
      style={[{ width: "100%", height: "100%" }]}
      toolbarEnabled={false}
      moveOnMarkerPress={false}
      provider={PROVIDER_GOOGLE}
      onMapReady={setBoundaries}
      paddingAdjustmentBehavior="automatic"
      mapPadding={mapPadding}
      customMapStyle={mapJSON}
    >
      {form && (
        <>
          {form.map((marker: any, index: any) => (
            <Marker
              key={`marker_${index}`}
              coordinate={{
                latitude: marker.latitude!,
                longitude: marker.longitude!,
              }}
              tappable={true}
              onPress={(event: any) => {}}
            >
              {marker.isKill == true ? (
                <FontAwesomeIcon icon={faCircle} color="red" size={20} />
              ) : (
                <FontAwesomeIcon icon={faCircle} color="green" size={20} />
              )}
              <Callout>
                <View style={styles.calloutView}>
                  <Text style={styles.calloutText}>
                    Quantité: {marker.quantity}
                  </Text>
                  <Text style={styles.calloutText}>
                    Statut: {marker.isKill == true ? " Tué " : " Vue "}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  calloutView: {
    width: 140,
  },
  calloutText: {
    textAlign: "center",
  },
});
const mapPadding = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};
