import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  useWindowDimensions,
  Button,
  Text,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { Image } from "react-native";
import { Picker } from "@react-native-picker/picker";

import MapView, {
  Callout,
  Marker,
  MarkerDragEvent,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import {
  faCircle,
  faCircleDot,
  faFlag,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { faGgCircle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IDuckTeamsModel } from "../model/DuckTeamsModel";

const initialRegion = {
  latitude: 50.69693758264165,
  longitude: -59.87274991348386,
  latitudeDelta: 0.006700103798038981,
  longitudeDelta: 0.01000028103589301,
};

export interface IImagePlottingProps {
  form: IDuckTeamsModel[];
  setForm: React.Dispatch<React.SetStateAction<IDuckTeamsModel[]>>;
}

const ImagePlotting = ({ form, setForm }: IImagePlottingProps) => {
  const { height, width } = useWindowDimensions();

  const [isAddingMarker, setIsAddingMarker] = useState(false);

  const initialRegionRef = useRef(initialRegion);
  const [region, setRegion] = useState(initialRegion);
  const mapRef = useRef<MapView>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

  const selectMarker = (markerId: number) => {
    setSelectedMarkerId(markerId);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [tempMarker, setTempMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handlePress = (e: any) => {
    const coor = e.nativeEvent.coordinate;
    if (isAddingMarker) {
      setTempMarker(coor);
      setModalVisible(true);
    }
  };

  const handleValidateModal = (
    sexe: string,
    statut: string,
    species: string
  ) => {
    if (tempMarker) {
      const newMarker = {
        latitude: tempMarker.latitude,
        longitude: tempMarker.longitude,
        sex: sexe,
        type: statut,
        specimen: species,
        id: form.length + 1,
        huntingID: undefined,
      };

      setForm((currentMarkers) => [...currentMarkers, newMarker]);
    }
    setModalVisible(false);
    setTempMarker(null);
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

  const onRegionChangeComplete = (newRegion: any) => {
    if (
      newRegion.latitudeDelta > initialRegion.latitudeDelta ||
      newRegion.longitudeDelta > initialRegion.longitudeDelta
    ) {
      mapRef.current?.animateToRegion(initialRegion, 200);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: width * 0.07,
        },
      ]}
    >
      <MapView
        ref={mapRef}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        onPress={handlePress}
        scrollEnabled={!isAddingMarker}
        zoomEnabled={!isAddingMarker}
        style={{ width: "100%", height: 350 }}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        provider={PROVIDER_GOOGLE}
        onMapReady={setBoundaries}
        paddingAdjustmentBehavior="automatic" // Pour Google Maps sur iOS
        mapPadding={mapPadding}
      >
        <>
          {form.map((marker, index) => (
            <Marker
              key={`marker_${index}`}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              tappable={false}
              draggable={true}
              onPress={(event) => {
                selectMarker(index + 1);
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
        </>
      </MapView>
      <SexeStatutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onValidate={handleValidateModal}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsAddingMarker(!isAddingMarker)}
      >
        <Text style={styles.buttonText}>
          {isAddingMarker ? "Arrêter d'ajouter" : "Ajouter un marqueur"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.trashCanIcon}
        onPress={() => {
          if (selectedMarkerId) {
            setForm((currentMarkers) =>
              currentMarkers.filter((marker) => marker.id !== selectedMarkerId)
            );
            setSelectedMarkerId(null);
          }
        }}
      >
        <FontAwesomeIcon icon={faTrash} size={30} />
      </TouchableOpacity>
    </View>
  );
};
const mapPadding = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

const styles = StyleSheet.create({
  trashCanIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginHorizontal: 10,
    borderRadius: 2,
    overflow: "hidden",
  },
  button: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    opacity: 0.8,
  },
  buttonText: {
    color: "black",
  },
  calloutView: {
    width: 140,
  },
  calloutText: {
    textAlign: "center",
  },
});

export default ImagePlotting;

const SexeStatutModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onValidate: (espesce: string, sexe: string, statut: string) => void;
}> = ({ visible, onClose, onValidate }) => {
  const [species, setSpecies] = useState<string>("Canard");
  const [sexe, setSexe] = useState<string>("Mâle");
  const [statut, setStatut] = useState<string>("Vivant");

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={stylesModal.centeredView}>
        <View style={stylesModal.modalView}>
          <Text style={stylesModal.pickerTitle}>Espèce :</Text>
          <Picker
            selectedValue={sexe}
            onValueChange={(itemValue) => setSexe(itemValue)}
            style={stylesModal.picker}
          >
            <Picker.Item label="Canard" value="Canard" />
            <Picker.Item label="Sifleur" value="Sifleur" />
          </Picker>
          <Text style={stylesModal.pickerTitle}>Sexe :</Text>
          <Picker
            selectedValue={sexe}
            onValueChange={(itemValue) => setSexe(itemValue)}
            style={stylesModal.picker}
          >
            <Picker.Item label="Mâle" value="Mâle" />
            <Picker.Item label="Femelle" value="Femelle" />
          </Picker>
          <Text style={stylesModal.pickerTitle}>Type :</Text>
          <Picker
            selectedValue={statut}
            onValueChange={(itemValue) => setStatut(itemValue)}
            style={stylesModal.picker}
          >
            <Picker.Item label="Vivant" value="Vivant" />
            <Picker.Item label="Forme" value="Forme" />
          </Picker>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              gap: 30,
            }}
          >
            <Button
              title="Valider"
              onPress={() => onValidate(sexe, statut, species)}
            />
            <Button
              title="Annuler"
              onPress={onClose}
              color={Platform.OS === "ios" ? "#007aff" : "#ff3b30"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const stylesModal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  picker: {
    width: 200,
    height: 44,
  },
  pickerTitle: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
  },
});
