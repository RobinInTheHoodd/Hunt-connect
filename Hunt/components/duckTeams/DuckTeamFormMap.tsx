import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState, useRef, useCallback, useMemo } from "react";
import { StyleSheet, Text } from "react-native";

import { View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from "react-native-maps";

import { IDuckTeamsModel } from "../../model/DuckTeamsModel";
import SkeletonExpo from "moti/build/skeleton/expo";
import React from "react";

const initialRegion = {
  latitude: 50.69693758264165,
  longitude: -59.87274991348386,
  latitudeDelta: 0.006700103798038981,
  longitudeDelta: 0.01000028103589301,
};

interface IDuckTeamFormMapProps {
  form: IDuckTeamsModel[];
  setForm: React.Dispatch<React.SetStateAction<IDuckTeamsModel[]>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isAddingMarker: boolean;
  setIsAddingMarker: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteMarker: boolean;
  setIsDeleteMarker: React.Dispatch<React.SetStateAction<boolean>>;
  setTempMarker: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
    } | null>
  >;
  setSelectedMarkerId: React.Dispatch<React.SetStateAction<number | null>>;
}

function DuckTeamFormMap({
  form,
  setForm,
  setModalVisible,
  isAddingMarker,
  setIsAddingMarker,
  isDeleteMarker,
  setIsDeleteMarker,
  setTempMarker,
  setSelectedMarkerId,
}: IDuckTeamFormMapProps) {
  const selectMarker = (markerId: number) => {
    setSelectedMarkerId(markerId);
  };

  const [region, setRegion] = useState(initialRegion);
  const mapRef = useRef<MapView>(null);
  const setBoundaries = useCallback(() => {
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
  }, [initialRegion]);

  const onRegionChangeComplete = (newRegion: any) => {
    if (
      newRegion.latitudeDelta > initialRegion.latitudeDelta ||
      newRegion.longitudeDelta > initialRegion.longitudeDelta
    ) {
      mapRef.current?.animateToRegion(initialRegion, 200);
    }
  };

  const handlePress = (e: any) => {
    const coor = e.nativeEvent.coordinate;
    if (isAddingMarker) {
      console.log(coor);
      setTempMarker(coor);
      setModalVisible(true);
    }
  };

  return (
    <MapView
      ref={mapRef}
      region={region}
      onRegionChangeComplete={onRegionChangeComplete}
      onPress={handlePress}
      scrollEnabled={!isAddingMarker}
      zoomEnabled={!isAddingMarker}
      style={{ width: "100%", height: "100%" }}
      toolbarEnabled={false}
      moveOnMarkerPress={false}
      provider={PROVIDER_GOOGLE}
      onMapReady={setBoundaries}
      paddingAdjustmentBehavior="automatic"
      mapPadding={mapPadding}
    >
      {form &&
        form.map((marker, index) => (
          <Marker
            key={`marker_${index}`}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            tappable={false}
            draggable={true}
            onPress={(event) => {
              if (isDeleteMarker) {
                setForm((currentMarkers) =>
                  currentMarkers.filter((marker) => marker.id !== index + 1)
                );
                setSelectedMarkerId(null);
              } else selectMarker(index + 1);
            }}
          >
            {marker.type === "Vivant" ? (
              <FontAwesomeIcon icon={faCircle} color="green" size={20} />
            ) : (
              <FontAwesomeIcon icon={faCircle} color="grey" size={20} />
            )}

            <Callout>
              <View style={styles.calloutView}>
                <Text style={styles.calloutText}>
                  Espèce: {marker.specimen}
                </Text>
                <Text style={styles.calloutText}>Sexe: {marker.sex}</Text>
                <Text style={styles.calloutText}>Statut: {marker.type}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
    </MapView>
  );
}

export default React.memo(DuckTeamFormMap);

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
