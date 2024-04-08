import React from "react";
import { View, Text, StyleSheet, ScrollView, LogBox } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { HuntingSessionController } from "../service/huntingSessionContrller";
import { useAppSelector } from "../redux/hook";
import HuntingSessionService from "../service/huntingSessionService";
import HuntingWeatherCard from "./hunting/screen/HuntingWeatherCard";
import HuntingObservation from "./hunting/screen/HuntingObservation";
import HuntingParticipant from "./hunting/screen/HuntingParticipant";
import HuntingMap from "./hunting/screen/HuntingMap";
import { Skeleton } from "moti/skeleton";
import ObservationService from "../service/observationService";
import SkeletonExpo from "moti/build/skeleton/expo";

const HuntingSessionInfo = ({
  navigation,
  HuntSession,
  header,
  isLoading,
}: any) => {
  const user = useAppSelector((state) => state.users);

  const huntingSessionService = new HuntingSessionService();
  const observationService = new ObservationService();

  const finishHuntingSession = async () => {
    try {
      await HuntingSessionController.finishHuntSession(HuntSession.id);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  LogBox.ignoreAllLogs();
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <SkeletonExpo.Group show={isLoading}>
        {header}

        <HuntingWeatherCard huntinSession={HuntSession} />

        <HuntingObservation navigation={navigation} huntSession={HuntSession} />

        <HuntingParticipant
          huntParticipant={HuntSession ? HuntSession.participants : undefined}
          isLoading={isLoading}
        />

        <HuntingMap
          ducksTeam={HuntSession ? HuntSession.duckTeams! : undefined}
          isFinish={HuntSession ? HuntSession.isFinish : true}
        />
      </SkeletonExpo.Group>

      {HuntSession && !HuntSession.isFinish && (
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
            <Skeleton show={isLoading} colorMode="light">
              <Text style={{ fontSize: 20 }}>Finir la session de chasse</Text>
            </Skeleton>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const colors = {
  white: "#ffffff",
  black: "#000000",
  blue: "#4DABEC",
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    padding: 15,
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#EEEEEE",
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
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: 350,

    backgroundColor: "#EEEEEE",

    borderWidth: 1,
    borderBottomWidth: 4,
    borderRightWidth: 4,

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
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
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
