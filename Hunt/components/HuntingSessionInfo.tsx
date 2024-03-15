import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Touchable,
  Button,
  Modal,
  TextInput,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
  faTemperatureQuarter,
  faWind,
  faDroplet,
  faUser,
  faPlusCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import WeatherService from "../service/weather/weatherService";
import WeatherInfoModel from "../model/WeatherModel";
import WeatherCardInfo from "./WeatherCardInfo";
import { IHuntingSessionModel } from "../model/HuntingSession";
import { IHuntingParticipanModel } from "../model/HuntingParticipantModel";
import ImagePlotting from "./ImagePlotting";
import { IDuckTeamsModel } from "../model/DuckTeamsModel";
import { HuntingSessionController } from "../service/huntingSessionContrller";

const HuntingSessionInfo = ({ navigation, HuntSession }: any) => {
  const finishHuntingSession = async () => {
    try {
      await HuntingSessionController.finishHuntSession(HuntSession.id);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {});
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Header navigation={navigation} name={HuntSession.weather!.name} />
          <WeatherCardInfo weather={HuntSession.weather!} />
          <HunterNightInfo navigation={navigation} />
          <HunterInfo huntParticipant={HuntSession.participants} />
          <DetailRows ducksTeam={HuntSession.duckTeams!} />

          {!HuntSession.isFinish && (
            <View
              style={[
                styles.cardContainer,
                {
                  alignItems: "center",
                  borderWidth: 2,
                },
              ]}
            >
              <TouchableOpacity onPress={finishHuntingSession}>
                <Text style={{ fontSize: 20 }}>Finir la session de chasse</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const Header = ({ navigation, name }: any) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          backgroundColor: "white",
          borderRadius: 15,
          borderWidth: 2,
          borderColor: "white",
          paddingVertical: 2,
          paddingHorizontal: 10,
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} color="black" size={30} />
      </TouchableOpacity>
    </View>
    <View style={styles.headerRight}>
      <View
        style={{ paddingRight: 11, flexDirection: "row", alignItems: "center" }}
      >
        <FontAwesomeIcon icon={faLocationDot} size={25} color={colors.black} />
        <Text style={styles.locationText}>{name}</Text>
      </View>
      <FontAwesomeIcon icon={faCalendarDays} size={25} color={colors.black} />
    </View>
  </View>
);

const DetailRows = ({ ducksTeam }: any) => {
  const [team, setTeam] = useState<IDuckTeamsModel[]>(ducksTeam);
  useEffect(() => {});
  return (
    <View style={[styles.cardContainer]}>
      {/* <Image
        source={require("../../../assets/images/maps.png")}
        style={[styles.backgroundImage, { opacity: 1 }]}
      /> */}
      <Text style={styles.detailValue}>Plan d'attelage</Text>

      <ImagePlotting form={team} setForm={setTeam} />
    </View>
  );
};

const HunterNightInfo = ({ navigation }: any) => {
  return (
    <View
      //onPress={() => navigation.navigate("Chasse")}
      style={styles.cardContainer}
    >
      <View style={styles.row}>
        {/* Total d'espèce tué */}
        <View style={[styles.halfCardContainer]}>
          <Text style={styles.feelsLikeText}>Espèces abattues</Text>
          <View>
            <Text style={styles.detailValue}>0</Text>
          </View>
        </View>
        {/* Top espèce tué */}

        <View style={[styles.halfCardContainer]}>
          <Text style={styles.feelsLikeText}>Espèce Dominante</Text>
          <View>
            <Text style={styles.detailValue}>/</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Chasse")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
          paddingTop: 20,
        }}
      >
        <Text>Tableau de bord</Text>
        <FontAwesomeIcon icon={faPlusCircle} size={20} color={"black"} />
      </TouchableOpacity>
    </View>
  );
};

const HunterInfo = ({ huntParticipant }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newHunter, setNewHunter] = useState({ name: "", status: "" });
  const [hunterList, setHunterList] = useState([
    { name: "Robin Mazouni", status: "chasseur" },
    { name: "Didier Mazouni", status: "chasseur" },
    { name: "Karine Mazouni", status: "chasseur" },
    { name: "Claire Mazouni", status: "chasseur" },
  ]);

  const [participants, setParticipants] =
    useState<IHuntingParticipanModel[]>(huntParticipant);

  useEffect(() => {});

  const addHunter = () => {
    setHunterList([...hunterList, newHunter]);
    setNewHunter({ name: "", status: "" });
    setModalVisible(false);
  };

  return (
    <View style={styles.cardContainer}>
      {participants.map((participant, index) => (
        <View style={styles.hunterItem} key={index}>
          <FontAwesomeIcon icon={faUser} size={20} color={colors.black} />
          <Text style={styles.hunterText}>{participant.displayName}</Text>
        </View>
      ))}

      {/* Bouton pour ouvrir le modal  TODO*/}
      {/* 
        <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <Text>Ajouter un chasseur</Text>
        <FontAwesomeIcon icon={faPlusCircle} size={20} color={"black"} />
      </TouchableOpacity>
      */}

      {/* TODO  Modal pour ajouter un nouveau chasseur */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setNewHunter({ ...newHunter, name: text })
              }
              value={newHunter.name}
              placeholder="Nom"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setNewHunter({ ...newHunter, status: text })
              }
              value={newHunter.status}
              placeholder="Statut (invité, chasseur)"
            />
            <Button title="Ajouter" onPress={addHunter} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const colors = {
  white: "#ffffff",
  black: "#000000",
  blue: "#4DABEC",
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",

    backgroundColor: "grey",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    width: "100%",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: colors.black,
    marginLeft: 8,
    fontSize: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: 350,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 350,
    //height: 252,
    opacity: 0.2,
  },
  dateText: {
    color: colors.black,
    fontSize: 18,
  },
  weatherDescription: {
    color: colors.black,
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  temperatureText: {
    color: colors.black,
    fontSize: 64,
    fontWeight: "bold",
  },
  weatherIcon: {
    width: 50,
    //height: 50,
  },
  temperatureRangeText: {
    alignSelf: "flex-end",
    color: colors.black,
    fontSize: 18,
  },

  halfCardContainer: {
    width: "48%",
  },
  detailItem: {
    marginBottom: 5,
  },
  detailText: {
    color: colors.black,
    fontSize: 16,
  },
  detailValue: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    color: colors.black,
    fontSize: 20,
    fontWeight: "bold",
  },
  feelsLikeText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  humidityText: {
    color: colors.black,
    fontSize: 16,
  },
  hunterItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  hunterText: {
    color: colors.black,
    marginLeft: 15,
    fontSize: 20,
  },
  input: {
    //height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});

export default HuntingSessionInfo;
