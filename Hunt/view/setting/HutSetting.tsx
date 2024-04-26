import { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useAppSelector } from "../../redux/hook";
import HuntingHeader from "../../components/hunting/screen/HuntingHeader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import InputText from "../../components/Input/InputText";
import { faPortrait, faTrash } from "@fortawesome/free-solid-svg-icons";
import HutService from "../../service/hutService";
import HutModel from "../../model/HutModel";
import HutHunterModel, { IHutHunterModel } from "../../model/HutHunterModel";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { UserContext } from "../../model/UserContext";

export default function HutSettingScreen({ navigation }: any) {
  const user: UserContext = useAppSelector((state) => state.users);
  const [emailHunter, setEmailHunter] = useState("");

  const hut: HutModel = useAppSelector((state) => state.hut!);

  const header = useMemo(() => {
    return (
      <HuntingHeader
        navigation={navigation}
        openModal={() => console.log("")}
        title={"Paramètres"}
      />
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#EEEEEE" }}>
        <View style={styles.scrollViewContainer}>
          {/* HEADER */}
          {header}

          {hut !== null && hut.ownerId == user.UIID ? (
            <>
              {/* AJOUT CHASSEUR */}
              <AddHunter
                emailHunter={emailHunter}
                setEmailHunter={setEmailHunter}
              />

              <View
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderColor: "grey",
                }}
              ></View>

              {/* DASHBOARD HUNTER*/}
              <Hunters />
            </>
          ) : (
            <></>
          )}
          {/* Demande pour rejoindre */}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const AddHunter = ({ emailHunter, setEmailHunter }: any) => {
  const { height, width } = useWindowDimensions();
  const hut: HutModel | null = useAppSelector((state) => state.hut);
  const hutService = new HutService();

  const addHunter = async () => {
    try {
      await hutService.addHunterByEmail(emailHunter, hut!.id!);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <InputText
        tagName={"Ajout d'un chasseur :"}
        value={emailHunter}
        onChangeText={(value) => {
          setEmailHunter(value);
        }}
        onBlur={() => {}}
        placeholder="email"
        iconName={faPortrait}
        isTouched={false}
        isValid={true}
        errorMessage={""}
        require={false}
        isPassword={false}
        styles={InputTextStyle(width, height)}
        isIconRight={false}
      />

      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity
          onPress={() => addHunter()}
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
          <Text style={{ fontSize: 15, fontWeight: "800" }}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const Hunters = () => {
  const hutService = new HutService();
  const hut: HutModel | null = useAppSelector((state) => state.hut);

  const [hunters, setHunter] = useState<HutHunterModel[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!hut!.hunter) setHunter([]);
      const rs: IHutHunterModel[] = await hutService.getHutHunterInfo(
        hut!.hunter
      );
      setHunter(rs);
    };
    if (hut != null) fetch();
    else setHunter([]);
  }, [hut]);

  const toggleDay = async (index: number, day: string) => {
    let updateHunter = {
      ...hunters[index],
      authorizeDay: { ...hunters[index].authorizeDay },
    };

    updateHunter.authorizeDay[day] = !updateHunter.authorizeDay[day];

    //console.log(JSON.stringify(updateHunter, null, 2));
    await hutService.updateHunterDay(hut!.id!, updateHunter);
  };

  const deleteHutHunter = async (index: number) => {
    await hutService.deleteHutHunter(hut!.id!, hunters[index].hunterID);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          paddingBottom: 5,
          marginBottom: 5,
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#34651e" }}>
          Chasseur :
        </Text>
      </View>
      <View>
        <View style={{ paddingBottom: 5 }}>
          {hunters.length !== 0 ? (
            hunters.map((val: HutHunterModel, index: number) => (
              <>
                <View style={[styles.row, { paddingBottom: 5 }]}>
                  <Text style={[styles.text, { width: 130 }]}>
                    {val.displayName}
                  </Text>
                  <Text style={[styles.text, styles.cell]}>{val.email}</Text>
                  <TouchableOpacity onPress={() => deleteHutHunter(index)}>
                    <FontAwesomeIcon icon={faTrash} size={20} />
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.row,
                    { paddingHorizontal: 15, paddingTop: 10 },
                  ]}
                >
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      height: 40,
                      width: 40,
                      borderRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => toggleDay(index, "monday")}
                  >
                    <Text
                      style={[
                        styles.text,
                        styles.row,
                        {
                          color: val.authorizeDay.monday ? "green" : "red",
                          fontSize: 25,
                        },
                      ]}
                    >
                      L
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      height: 40,
                      width: 40,
                      borderRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => toggleDay(index, "tuesday")}
                  >
                    <Text
                      style={[
                        styles.text,
                        styles.row,
                        {
                          color: val.authorizeDay.tuesday ? "green" : "red",
                          fontSize: 25,
                        },
                      ]}
                    >
                      M
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      height: 40,
                      width: 40,
                      borderRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => toggleDay(index, "wednesday")}
                  >
                    <Text
                      style={[
                        styles.text,
                        styles.row,
                        {
                          color: val.authorizeDay.wednesday ? "green" : "red",
                          fontSize: 25,
                        },
                      ]}
                    >
                      M
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleDay(index, "thursday")}
                    style={{
                      borderWidth: 1,
                      height: 40,
                      width: 40,
                      borderRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        styles.row,
                        {
                          color: val.authorizeDay.thursday ? "green" : "red",
                          fontSize: 25,
                        },
                      ]}
                    >
                      J
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleDay(index, "friday")}
                    style={{
                      borderWidth: 1,
                      height: 40,
                      width: 40,
                      borderRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        styles.row,
                        {
                          color: val.authorizeDay.friday ? "green" : "red",
                          fontSize: 25,
                        },
                      ]}
                    >
                      V
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      height: 40,
                      width: 40,
                      borderRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => toggleDay(index, "saturday")}
                  >
                    <Text
                      style={[
                        styles.text,
                        styles.row,
                        {
                          color: val.authorizeDay.saturday ? "green" : "red",
                          fontSize: 25,
                        },
                      ]}
                    >
                      S
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleDay(index, "sunday")}
                    style={{
                      borderWidth: 1,
                      height: 40,
                      width: 40,
                      borderRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        styles.row,
                        {
                          color: val.authorizeDay.sunday ? "green" : "red",
                          fontSize: 25,
                        },
                      ]}
                    >
                      D
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ))
          ) : (
            <></>
          )}
        </View>

        <View style={{ marginBottom: 4 }}></View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    padding: 15,
    flexGrow: 1,
    backgroundColor: "#EEEEEE",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cell: {
    flex: 1,
  },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
});

const InputTextStyle = (width: number, height: number) =>
  StyleSheet.create({
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
      fontSize: 20,
      fontWeight: "bold",
      color: "#34651e",
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
