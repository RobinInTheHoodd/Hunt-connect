import { faCircle, faCrow, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Button,
  Modal,
  Platform,
  StyleSheet,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  MarkerDragEvent,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { IDuckTeamsModel } from "../../model/DuckTeamsModel";
import { useState, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import SexeStatutModal from "./DuckTeamFormModal";
import DuckTeamFormMap from "./DuckTeamFormMap";
import DuckTeamFormButton from "./DuckTeamFormButton";

export interface IDuckTeamFormContentProps {
  form: IDuckTeamsModel[];
  setForm: React.Dispatch<React.SetStateAction<IDuckTeamsModel[]>>;
}
interface IMarker {
  latitude: number;
  longitude: number;
}
export default function DuckTeamFormContent({
  form,
  setForm,
}: IDuckTeamFormContentProps) {
  const { height, width } = useWindowDimensions();

  const [tempMarker, setTempMarker] = useState<IMarker | null>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [isDeleteMarker, setIsDeleteMarker] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
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

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        marginHorizontal: 10,
        overflow: "hidden",
        borderRadius: width * 0.07,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        flex: 1,
      }}
    >
      <DuckTeamFormMap
        form={form}
        setForm={setForm}
        setModalVisible={setModalVisible}
        isAddingMarker={isAddingMarker}
        setIsAddingMarker={setIsAddingMarker}
        isDeleteMarker={isDeleteMarker}
        setIsDeleteMarker={setIsDeleteMarker}
        setTempMarker={setTempMarker}
        setSelectedMarkerId={setSelectedMarkerId}
      />
      <SexeStatutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onValidate={handleValidateModal}
      />

      <DuckTeamFormButton
        isDeleteMarker={isAddingMarker}
        isAddingMarker={isDeleteMarker}
        setIsAddingMarker={setIsAddingMarker}
        setIsDeleteMarker={setIsDeleteMarker}
        setForm={setForm}
        selectedMarkerId={selectedMarkerId}
        setSelectedMarkerId={setSelectedMarkerId}
      />
    </View>
  );
}
