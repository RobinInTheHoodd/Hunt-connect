import { faCrow, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity, StyleSheet } from "react-native";
import { IDuckTeamsModel } from "../../model/DuckTeamsModel";
import React from "react";

interface IDuckTeamFormButtonProps {
  setForm: React.Dispatch<React.SetStateAction<IDuckTeamsModel[]>>;
  isAddingMarker: boolean;
  setIsAddingMarker: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteMarker: boolean;
  setIsDeleteMarker: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMarkerId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedMarkerId: number | null;
}

function DuckTeamFormButton({
  isDeleteMarker,
  isAddingMarker,
  setIsAddingMarker,
  setIsDeleteMarker,
  setForm,
  selectedMarkerId,
  setSelectedMarkerId,
}: IDuckTeamFormButtonProps) {
  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsAddingMarker(!isAddingMarker), setIsDeleteMarker(false);
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
            setForm((currentMarkers) =>
              currentMarkers.filter((marker) => marker.id !== selectedMarkerId)
            );
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

export default React.memo(DuckTeamFormButton);

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
