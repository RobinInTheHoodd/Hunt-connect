import { faCircle, faL, faLocation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Button,
  Platform,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from "react-native-maps";

import { IDuckTeamsModel } from "../../../model/DuckTeamsModel";
import ObservationFormDuckPosition from "../../../model/observation/ObservationFormDuckPosition";
import ObservationForm from "../../../model/observation/ObservationForm";
import DuckTeamFormButton from "../../duckTeams/DuckTeamFormButton";
import SexeStatutModal from "../../duckTeams/DuckTeamFormModal";
import ObservationFormModalMapButton from "./ObservationFormModalMapButton";
import { Picker } from "@react-native-picker/picker";
import InputText from "../../Input/InputText";
import { TouchableOpacity } from "react-native-gesture-handler";

const initialRegion = {
  latitude: 50.69693758264165,
  longitude: -59.87274991348386,
  latitudeDelta: 0.006700103798038981,
  longitudeDelta: 0.01000028103589301,
};
interface IMarker {
  latitude: number;
  longitude: number;
}

interface IDuckTeamFormMapProps {
  form: ObservationFormDuckPosition[];
  specimen: string;
  setForm: React.Dispatch<React.SetStateAction<ObservationForm>>;
  maxKill: number;
  maxView: number;
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isAddingMarker: boolean;
  setIsAddingMarker: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteMarker: boolean;
  tempMarker: IMarker | null;
  setIsDeleteMarker: React.Dispatch<React.SetStateAction<boolean>>;
  setTempMarker: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
    } | null>
  >;
  selectedMarkerId: number | null;
  setSelectedMarkerId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function ObservationFormMap({
  form,
  setForm,
  specimen,
  maxKill,
  maxView,
  isModalVisible,
  setModalVisible,
  isAddingMarker,
  setIsAddingMarker,
  isDeleteMarker,
  setIsDeleteMarker,
  tempMarker,
  setTempMarker,
  selectedMarkerId,
  setSelectedMarkerId,
}: IDuckTeamFormMapProps) {
  const selectMarker = (markerId: number) => {
    setSelectedMarkerId(markerId);
  };
  const { height, width } = useWindowDimensions();
  const [region, setRegion] = useState(initialRegion);
  const mapRef = useRef<MapView>(null);

  const ActuelView =
    (maxView === undefined ? 0 : maxView) -
    (maxKill === undefined ? 0 : maxKill) -
    form.reduce((total: any, current: any) => {
      if (!current.isKill) return total + current.quantity!;
      else return total;
    }, 0);

  const ActuelKill =
    (maxKill === undefined ? 0 : maxKill) -
    form.reduce((total: any, current: any) => {
      if (current.isKill!) return total + current.quantity!;
      else return total;
    }, 0);

  useEffect(() => {}, [form]);

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

  const handlePress = (e: any) => {
    const coor = e.nativeEvent.coordinate;
    if (isAddingMarker) {
      setTempMarker(coor);
      setModalVisible(true);
    }
  };

  const handleValidateModal = (isKill: boolean, quantity: number) => {
    if (tempMarker) {
      const newMarker = {
        latitude: tempMarker.latitude,
        longitude: tempMarker.longitude,
        quantity: quantity,
        id: Date.now(),
        isKill: isKill,
        errorMessage: "",
        isValid: true,
      };
      setForm((prev) => {
        return {
          ...prev,
          specimenPosition: [...prev.specimenPosition, newMarker],
        };
      });
    }
    setModalVisible(false);
    setTempMarker(null);
  };

  return (
    <View
      style={{
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Text
        style={{
          color: "#38761d",
          fontWeight: "bold",
          fontSize: width * 0.05,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        Position
      </Text>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          overflow: "hidden",
          borderRadius: 10,
          borderBottomWidth: 4,
          borderRightWidth: 4,
          height: 400,
          marginBottom: 10,
        }}
      >
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
          <>
            {form.map((marker, index) => (
              <Marker
                key={`marker_${index}`}
                coordinate={{
                  latitude: marker.latitude!,
                  longitude: marker.longitude!,
                }}
                tappable={false}
                draggable={true}
                onPress={(event: any) => {
                  if (isDeleteMarker) {
                    setForm((prev) => {
                      return {
                        ...prev,
                        specimenPosition: prev.specimenPosition.filter(
                          (markerTemp) => markerTemp.id !== marker.id
                        ),
                      };
                    });
                    setSelectedMarkerId(null);
                  } else selectMarker(index + 1);
                }}
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
        </MapView>

        <StatutModal
          maxKill={ActuelKill}
          maxView={ActuelView}
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onValidate={handleValidateModal}
        />

        <ObservationFormModalMapButton
          isDeleteMarker={isDeleteMarker}
          isAddingMarker={isAddingMarker}
          setIsAddingMarker={setIsAddingMarker}
          setIsDeleteMarker={setIsDeleteMarker}
          setForm={setForm}
          selectedMarkerId={selectedMarkerId}
          setSelectedMarkerId={setSelectedMarkerId}
        />
      </View>
    </View>
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

const StatutModal: React.FC<{
  maxKill: number;
  maxView: number;
  visible: boolean;
  onClose: () => void;
  onValidate: (isKill: boolean, number: number) => void;
}> = ({ maxKill, maxView, visible, onClose, onValidate }) => {
  const [isKill, setisKill] = useState<string>("Vue");
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { height, width } = useWindowDimensions();

  const validate = (number: number) => {
    try {
      if (isKill == "Tué") {
        if (number > maxKill)
          throw "LE nombre tué ne peut excéder : " + maxKill.toLocaleString();
      } else {
        if (number > maxView)
          throw "LE nombre vue ne peut excéder : " + maxView.toLocaleString();
      }
      setIsValid(true);
      setQuantity(number);
      setErrorMessage("");
    } catch (e: any) {
      setErrorMessage(e);
      setIsValid(false);
      setQuantity(number);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={stylesModal.centeredView}>
        <View style={stylesModal.modalView}>
          <Text style={stylesModal.pickerTitle}>Observation :</Text>
          <Picker
            selectedValue={isKill}
            onValueChange={(itemValue) => setisKill(itemValue)}
            style={stylesModal.picker}
          >
            <Picker.Item label="Vue" value="Vue" />
            <Picker.Item label="Tué" value="Tué" />
          </Picker>

          <InputText
            tagName={"Nombre"}
            value={quantity == undefined ? "" : quantity.toString()}
            onChangeText={(value) => {
              validate(value!);
            }}
            onBlur={() => {}}
            placeholder="0"
            iconName={faLocation}
            isTouched={false}
            isValid={isValid}
            errorMessage={errorMessage}
            require={false}
            isPassword={false}
            styles={InputTextStyle(width, height)}
            isIconRight={false}
            keyboard="numeric"
          />

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
              disabled={!isValid || quantity == 0}
              onPress={() => {
                setErrorMessage("");
                setQuantity(undefined);
                setIsValid(false);
                onValidate(isKill == "Tué", Number(quantity));
              }}
              color={"green"}
            />
            <Button title="Annuler" color={"red"} onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const stylesModal = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    height: 500,
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

const InputTextStyle = (width: number, height: number) =>
  StyleSheet.create({
    container: { flex: 1 },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderColor: "black",
      marginBottom: height * 0.01,
      marginTop: 5,
      paddingHorizontal: 10,
      backgroundColor: "#FFF",
      width: "50%",
    },
    invalidInput: {
      borderBottomColor: "red",
    },
    validInput: {
      borderBottomColor: "green",
    },
    inputTag: {
      color: "#38761d",
      fontWeight: "bold",
      fontSize: width * 0.05,
    },
    input: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: width * 0.008,
      fontWeight: "bold",
      fontSize: width * 0.045,
      color: "black",
    },
    icon: {
      marginRight: 10,
    },
    errorMessage: {
      color: "red",
      fontSize: 14,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
    },
    bubbleButton: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      //backgroundColor: "#2196F3",
    },
    selectedBubbleButton: {
      borderRadius: 50,
      borderWidth: 4,
      borderColor: "#38761d",
    },
  });
