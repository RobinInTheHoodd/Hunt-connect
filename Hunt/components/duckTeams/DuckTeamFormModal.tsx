import { useState } from "react";
import { Modal, View, Button, Platform, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React from "react";

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

export default React.memo(SexeStatutModal);

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
