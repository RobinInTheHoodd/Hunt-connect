import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import {
  IGuestModel,
  IParticipantModel,
  ParticipantFormModel,
} from "../model/ParticipantFormModel";
import InputText from "./Input/InputText";
import {
  faLocation,
  faPlus,
  faPlusCircle,
  faPortrait,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAppSelector } from "../redux/hook";

export interface IParticipantFormProps {
  form: ParticipantFormModel;
  setForm: React.Dispatch<React.SetStateAction<ParticipantFormModel>>;
}

const ParticipantForm = ({ form, setForm }: IParticipantFormProps) => {
  const user = useAppSelector((state) => state.users);
  const { height, width } = useWindowDimensions();
  useEffect(() => {
    console.log(form);
  }, [form, setForm, user]);

  const handleAddParticipant = () => {
    const newParticipant: IParticipantModel = {
      displayName: "",
      ID: (form.participants.length + 1).toString(),
    };
    setForm((previousForm) => ({
      ...previousForm,
      participants: [...previousForm.participants, newParticipant],
    }));
  };
  const handleRemoveParticipant = (indexToRemove: number) => {
    setForm((previousForm) => ({
      ...previousForm,
      participants: previousForm.participants.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleAddGuest = () => {
    const newGuest: IGuestModel = {
      ID: (form.participants.length + 1).toString(),
      displayName: "",
      displayNameTouched: false,
      displayNameError: "",
      isDisplayNameValid: false,
    };
    setForm((previousForm) => ({
      ...previousForm,
      participants: [...previousForm.guest, newGuest],
    }));
  };

  const handleRemoveGuest = (indexToRemove: number) => {
    setForm((previousForm) => ({
      ...previousForm,
      guest: previousForm.guest.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <ScrollView>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: width * 0.07,
            fontWeight: "bold",
            marginVertical: 20,
          }}
        >
          Participants / Invités
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          alignItems: "center",
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "grey",
        }}
      >
        <Text style={{ fontSize: 20, fontStyle: "italic" }}>
          Participants :
        </Text>
        <TouchableOpacity onPress={handleAddParticipant}>
          <FontAwesomeIcon icon={faPlusCircle} size={30} />
        </TouchableOpacity>
      </View>
      {form.participants.length != 0 ? (
        <>
          {form.participants.map((participant, index) => (
            <View key={index} style={{ paddingHorizontal: 10 }}>
              <InputText
                tagName={""}
                value={participant.displayName}
                onChangeText={(value) => {
                  const updatedParticipants = [...form.participants];
                  updatedParticipants[index].displayName = value;
                  setForm({ ...form, participants: updatedParticipants });
                }}
                onBlur={() => {}}
                placeholder="Nom du participant"
                iconName={faLocation}
                isTouched={false}
                isValid={true}
                errorMessage={""}
                require={false}
                isPassword={false}
                styles={InputTextStyle(width, height)}
                isIconRight={participant.ID == user.UIID ? false : true}
                setIconRight={() => handleRemoveParticipant(index)}
                IconRight={faTrashCan}
              />
            </View>
          ))}
        </>
      ) : (
        <></>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: height * 0.03,
          paddingHorizontal: 15,
          alignItems: "center",
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "grey",
        }}
      >
        <Text style={{ fontSize: 20, fontStyle: "italic" }}>Invités :</Text>
        <TouchableOpacity onPress={handleAddGuest}>
          <FontAwesomeIcon icon={faPlusCircle} size={30} />
        </TouchableOpacity>
      </View>
      {form.guest.length != 0 ? (
        <>
          {form.guest.map((guest, index) => (
            <View key={index} style={{ paddingHorizontal: 10 }}>
              <InputText
                tagName={""}
                value={guest.displayName}
                onChangeText={(value) => {
                  const updatedGuest = [...form.guest];
                  updatedGuest[index].displayName = value;
                  setForm({ ...form, guest: updatedGuest });
                }}
                onBlur={() => {}}
                placeholder="Nom du participant"
                iconName={faLocation}
                isTouched={false}
                isValid={true}
                errorMessage={""}
                require={false}
                isPassword={false}
                styles={InputTextStyle(width, height)}
                isIconRight={guest.ID == user.UIID ? false : true}
                setIconRight={() => handleRemoveGuest(index)}
                IconRight={faTrashCan}
              />
            </View>
          ))}
        </>
      ) : (
        <></>
      )}
    </ScrollView>
  );
};

const InputTextStyle = (width: number, height: number) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      marginBottom: height * 0.01,
      paddingHorizontal: 10,
    },
    invalidInput: {
      borderBottomColor: "red",
    },
    validInput: {
      borderBottomColor: "green",
    },
    inputTag: {
      color: "green",
      fontWeight: "bold",
      fontSize: width * 0.04,
    },
    input: {
      flex: 1,
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.02,
    },
    icon: {
      marginRight: 10,
    },
    errorMessage: {
      color: "red",
      fontSize: 14,
    },
  });

export default ParticipantForm;
