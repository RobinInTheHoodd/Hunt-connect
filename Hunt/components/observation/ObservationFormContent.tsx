import {
  useWindowDimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { IParticipantModel } from "../../model/ParticipantFormModel";

import { useEffect, useState } from "react";
import ObservationFormModal from "./ObservationFormModal";

import { ScrollView } from "react-native-gesture-handler";
import ObservationModel, {
  IObservationModel,
} from "../../model/form/ObservationModel";

import ObservationFormDuckPosition from "../../model/observation/ObservationFormDuckPosition";
import ObservationFormMap from "./ObservationFormMap";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPencil,
  faPlus,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ObservationForm from "../../model/observation/ObservationForm";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import ObservationService from "../../service/observationService";
import {
  removeObservation,
  selectObservations,
  updateObservation,
} from "../../redux/reducers/observationSlice";

interface IObservationFormContentProps {
  huntingID: number;
  observations: ObservationModel[];
}

export default function ObservationFormContent({
  huntingID,
  observations,
}: IObservationFormContentProps) {
  const observationService = new ObservationService();
  const [isVisible, setIsVisibile] = useState(false);
  const { height, width } = useWindowDimensions();
  const user = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const [observationForm, setObservationForm] = useState<ObservationForm>(
    new ObservationForm(undefined, user!.UIID, huntingID)
  );

  let mergedArray: ObservationFormDuckPosition[] = observations.reduce(
    (accumulator: ObservationFormDuckPosition[], current) => {
      return accumulator.concat(current.specimenPosition);
    },
    []
  );

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <ObservationFormModal
        isVisible={isVisible}
        onClose={() => {
          setIsVisibile(false);
        }}
        observationForm={observationForm}
        setObservationForm={setObservationForm}
      />

      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontWeight: "bold",
              color: "#38761d",
              fontSize: 15,
            }}
          >
            Spécimen
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: "bold",
              color: "#38761d",
              fontSize: 15,
            }}
          >
            Vue / Tué
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: "bold",
              color: "#38761d",
              fontSize: 15,
            }}
          >
            Mouvement
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsVisibile(true),
                setObservationForm(
                  new ObservationForm(undefined, user.UIID, huntingID)
                );
            }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faPlusCircle} size={25} color="#38761d" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ height: 200 }}>
          {observations.map((row: ObservationModel, index) => (
            <View
              key={Math.random()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <Text key={Math.random()} style={{ flex: 1 }}>
                {row.specimen}
              </Text>
              <Text key={Math.random()} style={{ flex: 1 }}>
                {row.quantityView}/{row.quantityKill}
              </Text>
              <Text key={Math.random()} style={{ flex: 1 }}>
                {row.isInPose == true ? "En pose" : "En vol"}
              </Text>

              <TouchableOpacity
                key={Math.random()}
                style={{
                  flex: 0.5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  const form: ObservationForm = ObservationModel.toForm(row);
                  setObservationForm(form);
                  setIsVisibile(true);
                }}
              >
                <FontAwesomeIcon
                  key={Math.random()}
                  icon={faPencil}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                key={Math.random()}
                style={{
                  flex: 0.5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={async () => {
                  await observationService.deleteObservation(
                    row.id!,
                    row.huntingSession
                  );
                  dispatch(removeObservation(row.id!));
                }}
              >
                <FontAwesomeIcon
                  key={Math.random()}
                  icon={faTrash}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Text style={[styles.headerRow, { marginTop: 10, marginBottom: 5 }]}>
          Positions
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
            height: 300,
            marginBottom: 10,
          }}
        >
          <ObservationFormMap form={mergedArray} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 5,
    marginBottom: 5,
    width: 350,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 10,
    borderWidth: 1,

    borderColor: "black",

    marginTop: 5,
    backgroundColor: "#FFF",
  },
  content: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 14,
  },
  headerRow: {
    color: "#38761d",
    fontWeight: "bold",
    fontSize: 15,
  },
});
