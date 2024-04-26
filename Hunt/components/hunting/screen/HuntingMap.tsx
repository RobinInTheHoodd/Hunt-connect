import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IDuckTeamsModel } from "../../../model/DuckTeamsModel";
import DuckTeamFormContent from "../../duckTeams/DuckTeamFormContent";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import HuntingMapContent from "./HuntingMapContent";
import SkeletonExpo from "moti/build/skeleton/expo";
import React from "react";

function HuntingMap({ ducksTeam, isFinish }: any) {
  const styles = style(ducksTeam);
  return (
    <View style={[styles.cardContainer, { height: 400 }]}>
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            paddingBottom: 5,
            marginBottom: 5,
          }}
        >
          <SkeletonExpo disableExitAnimation={true} colorMode="light">
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#34651e" }}
            >
              Tableau de bord
            </Text>
          </SkeletonExpo>
        </View>

        <SkeletonExpo
          boxHeight={300}
          colorMode="light"
          disableExitAnimation={true}
        >
          {ducksTeam !== undefined ? (
            <HuntingMapContent
              form={ducksTeam}
              setForm={() => {}}
              isFinish={isFinish}
            />
          ) : (
            <></>
          )}
        </SkeletonExpo>
      </>
    </View>
  );
}

export default React.memo(HuntingMap);

const style = (duckTeams: any) =>
  StyleSheet.create({
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
    detailValue: {
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      color: "black",
      fontSize: 20,
      fontWeight: "bold",
    },
  });
