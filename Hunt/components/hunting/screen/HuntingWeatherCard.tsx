import { faWind, faDroplet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState, useEffect, Profiler } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import WeatherInfoModel from "../../../model/WeatherModel";
import WeatherService from "../../../service/weather/weatherService";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React from "react";
import SkeletonExpo from "moti/build/skeleton/expo";

function HuntingWeatherCard({ huntinSession }: any) {
  const [date, setDate] = useState<any>();
  const styles = style(huntinSession);
  useEffect(() => {
    if (huntinSession !== undefined)
      setDate(
        new Date(huntinSession.fromDate).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
        })
      );
  }, [huntinSession]);

  return (
    <View style={styles.cardContainer}>
      <SkeletonExpo show={huntinSession === undefined} colorMode="light">
        <>
          <View style={styles.rowSpaceBetween}>
            <SkeletonExpo colorMode="light" disableExitAnimation={true}>
              <Text style={styles.huntName}>HUTTE NAME</Text>
            </SkeletonExpo>

            <SkeletonExpo colorMode="light" disableExitAnimation={true}>
              <Text style={styles.dateText}>
                {" "}
                {date === undefined ? "" : "Le " + date}
              </Text>
            </SkeletonExpo>
          </View>

          <View style={[styles.row]}>
            <SkeletonExpo
              radius={"round"}
              height={60}
              width={60}
              colorMode="light"
              disableExitAnimation={true}
            >
              <Text
                style={[styles.temperatureText, { justifyContent: "center" }]}
              >
                {huntinSession === undefined
                  ? ""
                  : " " + huntinSession.weather.tempC + "°"}
              </Text>
            </SkeletonExpo>

            <SkeletonExpo
              boxHeight={30}
              colorMode="light"
              disableExitAnimation={true}
            >
              <Text style={styles.weatherDescription}>
                {huntinSession === undefined
                  ? ""
                  : huntinSession.weather.conditionText}
              </Text>
            </SkeletonExpo>
          </View>

          <View style={[styles.row, { marginTop: 5 }]}>
            <SkeletonExpo colorMode="light" disableExitAnimation={true}>
              <View style={styles.detailItem}>
                <Text style={styles.detailValue}>
                  <FontAwesomeIcon icon={faWind} />{" "}
                  {huntinSession === undefined
                    ? ""
                    : huntinSession.weather.windKph + " km/h  -  "}
                  <Text style={styles.detailText}>
                    {huntinSession === undefined
                      ? ""
                      : huntinSession.weather.windDir}
                  </Text>
                </Text>
              </View>
            </SkeletonExpo>
            <SkeletonExpo colorMode="light" disableExitAnimation={true}>
              <View style={styles.detailItem}>
                <Text style={styles.detailValue}>
                  <FontAwesomeIcon icon={faDroplet} />{" "}
                  {huntinSession === undefined
                    ? ""
                    : " " + huntinSession.weather.humidity + " %"}
                </Text>
              </View>
            </SkeletonExpo>
          </View>
        </>
      </SkeletonExpo>
    </View>
  );
}
export default React.memo(HuntingWeatherCard);

const style = (huntSession: any) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: "#EEEEEE",
      padding: huntSession ? 15 : 0,
      borderRadius: 8,
      marginBottom: 10,
      width: 350,

      borderWidth: 1,
      borderBottomWidth: 3,
      borderRightWidth: 3,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    rowSpaceBetween: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 5,
    },
    backgroundImage: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 350,
      height: 252,
      opacity: 0.2,
    },
    dateText: {
      color: "black",
      fontSize: 18,
      fontWeight: "500",
    },
    weatherDescription: {
      color: "black",
      fontSize: 16,
      fontWeight: "500",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    temperatureText: {
      color: "black",
      fontSize: 40,
      fontWeight: "bold",
    },
    weatherIcon: {
      width: 50,
      height: 50,
    },
    temperatureRangeText: {
      alignSelf: "flex-end",
      color: "black",
      fontSize: 18,
    },
    detailItem: {
      marginBottom: 5,
    },
    detailText: {
      color: "black",
      fontSize: 16,
      fontWeight: "500",
    },
    detailValue: {
      marginTop: 5,
      marginLeft: 5,
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
    huntName: {
      fontSize: 18,
      fontWeight: "500",
    },
  });
