import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import ObservationFormBubble from "./modal/ObservationFormModalBubble";
import ObservationFormMap from "./modal/ObservationFormModalMap";
import ObservationFormSpecimen from "./modal/ObservationFormModalSpecimen";
import ObservationFormTimeDatePicker from "./modal/ObservationFormModalTimeDatePicker";
import ObservationFormViewKill from "./modal/ObservationFormModalViewKill";
import { IDuckTeamsModel } from "../../model/DuckTeamsModel";
import { ScrollView } from "react-native-gesture-handler";
import ObservationForm from "../../model/observation/ObservationForm";
import ObservationFormTimeDateModel from "../../model/observation/ObservationFormTimeDateModel";
import ObservationFormTimeDate from "./modal/ObservationFormModalTimeDate";
import ObservationFormDuckPosition from "../../model/observation/ObservationFormDuckPosition";
import SexeStatutModal from "../duckTeams/DuckTeamFormModal";
import ObservationModel from "../../model/form/ObservationModel";
import ObservationService from "../../service/observationService";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  addObservation,
  updateObservation,
} from "../../redux/reducers/observationSlice";

interface ObservationFormModal {
  isVisible: boolean;
  onClose: () => void;
  observationForm: ObservationForm;
  setObservationForm: React.Dispatch<React.SetStateAction<ObservationForm>>;
}
interface IMarker {
  latitude: number;
  longitude: number;
}
export default function ({
  isVisible,
  onClose,
  observationForm,
  setObservationForm,
}: ObservationFormModal) {
  const observationService = new ObservationService();
  const { height, width } = useWindowDimensions();
  const styles = InputTextStyle(width, height);
  const [openPickerId, setOpenPickerId] = useState(false);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const user = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const obs = useAppSelector((state) => state.observations);

  const [tempMarker, setTempMarker] = useState<IMarker | null>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [isDeleteMarker, setIsDeleteMarker] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const selected =
      typeof observationForm.bubble.isFly === "undefined"
        ? null
        : observationForm.bubble.isFly === true
        ? 1
        : 2;
    setSelectedButton(selected);
  }, [observationForm]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 15,
            }}
          >
            <ObservationFormSpecimen
              form={observationForm.specimen}
              setForm={setObservationForm}
              openPickerId={openPickerId}
              setOpenPickerId={setOpenPickerId}
            />

            <ObservationFormBubble
              form={observationForm.bubble}
              setForm={setObservationForm}
              selectedButton={selectedButton}
              setSelectedButton={setSelectedButton}
            />

            <ObservationFormViewKill
              form={observationForm.quantity}
              setForm={setObservationForm}
            />

            <ObservationFormTimeDate
              form={observationForm.date}
              setForm={setObservationForm}
            />

            <ObservationFormMap
              form={observationForm.specimenPosition}
              setForm={setObservationForm}
              maxKill={observationForm.quantity.kill!}
              maxView={observationForm.quantity.view!}
              specimen={observationForm.specimen.specimen!}
              isModalVisible={modalVisible}
              setModalVisible={setModalVisible}
              isAddingMarker={isAddingMarker}
              setIsAddingMarker={setIsAddingMarker}
              tempMarker={tempMarker}
              isDeleteMarker={isDeleteMarker}
              setIsDeleteMarker={setIsDeleteMarker}
              setTempMarker={setTempMarker}
              selectedMarkerId={selectedMarkerId}
              setSelectedMarkerId={setSelectedMarkerId}
            />

            <View style={{ flex: 1 }}>
              {observationForm.specimenPositionErreur != "" ? (
                <Text style={{ color: "red", paddingBottom: 5 }}>
                  {observationForm.specimenPositionErreur}
                </Text>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  onClose();
                }}
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderBottomWidth: 4,
                  borderRightWidth: 4,
                  alignItems: "center",
                  justifyContent: "center",
                  width: 120,
                  height: 40,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "800" }}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  const rs = ObservationForm.isValide(observationForm);
                  setObservationForm(rs);
                  if (rs.isValid) {
                    try {
                      if (typeof rs.id !== "undefined") {
                        const res = await observationService.updateObservations(
                          rs,
                          user.UIID
                        );
                      } else {
                        const res: ObservationModel | undefined =
                          await observationService.addObservation(
                            rs,
                            user.UIID
                          );
                      }
                    } catch (e) {}
                    onClose();
                  }
                }}
                style={{
                  borderWidth: 1,
                  borderBottomWidth: 4,
                  borderRightWidth: 4,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  width: 120,
                  height: 40,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "800" }}>Suivant</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const InputTextStyle = (width: number, height: number) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      flex: 1,
      width: "90%",
      paddingTop: 10,
      paddingBottom: 3,
      maxHeight: "90%",
      backgroundColor: "white",
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      marginTop: 10,
      backgroundColor: "#2196F3",
      //padding: 10,
      borderRadius: 20,
    },
  });
