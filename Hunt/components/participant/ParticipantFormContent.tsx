import {
  faLocation,
  faPlusCircle,
  faTrash,
  faTrashCan,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MyCustomPicker from "../Input/CustomPicker";
import {
  IGuestModel,
  IParticipantModel,
  ParticipantFormModel,
} from "../../model/ParticipantFormModel";
import InputText from "../Input/InputText";
import { useAppSelector } from "../../redux/hook";
import HutService from "../../service/hutService";
import HuntingParticipantModel, {
  IHuntingParticipanModel,
} from "../../model/HuntingParticipantModel";

export interface IParticipantFormProps {
  form: IHuntingParticipanModel[];
  setForm: React.Dispatch<React.SetStateAction<IHuntingParticipanModel[]>>;
}

const hutService = new HutService();

export default function ParticipantFormContent({
  form,
  setForm,
}: IParticipantFormProps) {
  const user = useAppSelector((state) => state.users);
  const { height, width } = useWindowDimensions();
  const [optionsParticipant, setOptionsParticipant] = useState<
    IHuntingParticipanModel[]
  >([]);

  const [pickers, setPickers] = useState([
    {
      id: Math.random(),
      selectedValue: new HuntingParticipantModel(
        undefined,
        "Participant",
        undefined
      ),
    },
  ]);

  useEffect(() => {
    const fetchParticipants = async () => {
      let res = await hutService.getHutParticipantsByHutID(1);
      if (res !== undefined) {
        const hutParticipants: IHuntingParticipanModel[] = res;
        hutParticipants.push({
          displayName: "ROBIN",
          role: "Participant",
          userID: user.UIID,
        });
        let fetParticipants = hutParticipants.map((hutParticipant) => ({
          displayName: hutParticipant.displayName!,
          userID: hutParticipant.userID!,
          role: "Participant",
        }));
        setOptionsParticipant((prevOptions) => [
          ...prevOptions,
          ...fetParticipants,
        ]);
      }
    };
    fetchParticipants();
  }, []);

  useEffect(() => {}, [optionsParticipant, form, user]);

  const handleAddGuest = () => {
    const id = Math.random().toLocaleString();
    const gu = new HuntingParticipantModel("", "Invité", id);
    setForm((prev) => [...prev, gu]);
  };

  const handleRemoveGuest = (indexToRemove: string) => {
    setForm((previousForm) =>
      previousForm.filter((value) => value.userID !== indexToRemove)
    );
  };

  const [openPickerId, setOpenPickerId] = useState(null);
  const removePicker = (id: any) => {
    const pickerToRemove = pickers.find((picker) => picker.id === id);

    if (pickerToRemove) {
      if (pickerToRemove.selectedValue == undefined)
        setPickers((current) => current.filter((picker) => picker.id !== id));
      else {
        const userIDToRemove = pickerToRemove.selectedValue.userID;

        setForm((currentParticipants) =>
          currentParticipants.filter(
            (participant) => participant.userID !== userIDToRemove
          )
        );
        setPickers((current) => current.filter((picker) => picker.id !== id));
      }
    }
  };

  const handleSelect = (value: IHuntingParticipanModel, id: any) => {
    setPickers((current) =>
      current.map((picker) => {
        if (picker.id === id) {
          setForm((currentParticipant) => [...currentParticipant, value]);
          return { ...picker, selectedValue: value };
        }
        return picker;
      })
    );
    setOpenPickerId(null);
  };

  const toggleOpen = (id: any) => {
    setOpenPickerId((currentOpenId) => (currentOpenId === id ? null : id));
  };

  const addPicker = () => {
    setPickers((current) => [
      ...current,
      {
        id: Math.random(),
        selectedValue: new HuntingParticipantModel(
          undefined,
          "Participant",
          undefined
        ),
      },
    ]);
  };
  return (
    <View style={{ flex: 1 }}>
      {/* PARTICIPANT  */}
      <View style={{ height: height * 0.5 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            alignItems: "center",
            paddingBottom: 10,
            marginBottom: 5,
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Text style={{ fontSize: 20, fontStyle: "italic" }}>
            Participants :
          </Text>
          <TouchableOpacity onPress={addPicker}>
            <FontAwesomeIcon icon={faPlusCircle} size={25} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {pickers.map((picker, index) => (
            <View style={{ paddingVertical: 5 }} key={picker.id}>
              <MyCustomPicker
                key={picker.id}
                items={optionsParticipant}
                onItemSelect={(value: IHuntingParticipanModel) =>
                  handleSelect(value, picker.id)
                }
                title={picker.selectedValue.displayName}
                isOpen={openPickerId === picker.id}
                toggleOpen={() => toggleOpen(picker.id)}
                iconLeft={faUser}
                removePicker={() => removePicker(picker.id)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* INVITÉ  */}
      <View style={{ height: 0.25 * height }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            alignItems: "center",
            paddingBottom: 10,
            marginBottom: 5,
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Text style={{ fontSize: 20, fontStyle: "italic" }}>Invités :</Text>
          <TouchableOpacity onPress={handleAddGuest}>
            <FontAwesomeIcon icon={faPlusCircle} size={25} />
          </TouchableOpacity>
        </View>
        {form.length != 0 ? (
          <ScrollView>
            {form.map(
              (guest, index) =>
                guest.role == "Invité" && (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <InputText
                      tagName={""}
                      value={guest.displayName || ""}
                      onChangeText={(value) => {
                        const updatedParticipants = form.map((p) => {
                          if (p.userID === guest.userID) {
                            return new HuntingParticipantModel(
                              value,
                              "Invité",
                              p.userID
                            );
                          }
                          return p;
                        });

                        setForm(updatedParticipants);
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
                      isIconRight={false}
                    />
                    <TouchableOpacity
                      onPress={() => handleRemoveGuest(guest.userID!)}
                      style={{ padding: 15, marginRight: 3 }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        size={20}
                        color="#970808"
                      />
                    </TouchableOpacity>
                  </View>
                )
            )}
          </ScrollView>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

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
  });
