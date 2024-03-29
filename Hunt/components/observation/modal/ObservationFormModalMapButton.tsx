import { faCrow, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import ObservationForm from "../../../model/observation/ObservationForm";

interface IObservationFormModalMapButtonProps {
  setForm: React.Dispatch<React.SetStateAction<ObservationForm>>;
  isAddingMarker: boolean;
  setIsAddingMarker: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteMarker: boolean;
  setIsDeleteMarker: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMarkerId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedMarkerId: number | null;
}

export default function ObservationFormModalMapButton({
  isDeleteMarker,
  isAddingMarker,
  setIsAddingMarker,
  setIsDeleteMarker,
  setForm,
  selectedMarkerId,
  setSelectedMarkerId,
}: IObservationFormModalMapButtonProps) {
  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsAddingMarker(!isAddingMarker);
          setIsDeleteMarker(false);
        }}
      >
        <FontAwesomeIcon
          icon={faCrow}
          size={30}
          color={isAddingMarker ? "green" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.trashCanIcon}
        onPress={() => {
          setIsDeleteMarker(!isDeleteMarker);
          setIsAddingMarker(false);
          if (selectedMarkerId && isDeleteMarker) {
            setForm((prev) => {
              return {
                ...prev,
                specimenPosition: prev.specimenPosition.filter(
                  (marker) => marker.id !== selectedMarkerId
                ),
              };
            });
            setSelectedMarkerId(null);
          }
        }}
      >
        <FontAwesomeIcon
          icon={faTrash}
          size={30}
          color={isDeleteMarker ? "red" : "black"}
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  trashCanIcon: {
    position: "absolute",
    top: 80,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    opacity: 0.8,
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
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    opacity: 0.8,
  },
  buttonText: {
    color: "black",
  },
});
