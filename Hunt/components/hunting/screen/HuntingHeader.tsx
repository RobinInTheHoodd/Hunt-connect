import {
  faArrowLeft,
  faCalendarDays,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const HuntingHeader = React.memo(
  ({ navigation, openModal, title }: any) => {
    console.log("RENDER HuntingHeader");

    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{}}>
            <FontAwesomeIcon icon={faArrowLeft} color="black" size={24} />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.locationText}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          <View
            style={{
              paddingRight: 11,
              flexDirection: "row",
              alignItems: "center",
            }}
          ></View>
          <TouchableOpacity onPress={() => openModal()}>
            <FontAwesomeIcon icon={faCalendarDays} size={24} color={"black"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

/*

*/

export default HuntingHeader;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#EEEEEE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
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
    fontFamily: "Droid Sans Mono",
    fontSize: 27,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#34651e",
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
    color: "black",
    fontSize: 18,
  },
  weatherDescription: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  temperatureText: {
    color: "black",
    fontSize: 64,
    fontWeight: "bold",
  },
  weatherIcon: {
    width: 50,
    //height: 50,
  },
});
