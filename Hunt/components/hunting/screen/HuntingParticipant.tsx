import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useMemo, useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { IHuntingParticipanModel } from "../../../model/HuntingParticipantModel";
import { faPlusCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import SkeletonExpo from "moti/build/skeleton/expo";
import React from "react";

function HuntingParticipant({ huntParticipant }: any) {
  const styles = style(huntParticipant);
  return (
    <View style={styles.cardContainer}>
      <SkeletonExpo show={huntParticipant === undefined} colorMode="light">
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
                Participants
              </Text>
            </SkeletonExpo>
          </View>
          <View>
            <View style={{ paddingBottom: 5 }}>
              <SkeletonExpo colorMode="light" disableExitAnimation={true}>
                <View style={styles.row}>
                  <Text style={[styles.text, { width: 80 }]}></Text>
                  <Text style={[styles.text, styles.cell]}>Rôle</Text>
                  <Text
                    style={[styles.text, styles.cell, { textAlign: "center" }]}
                  >
                    Prénom nom
                  </Text>
                </View>
              </SkeletonExpo>
            </View>
            <View style={{ marginBottom: 4 }}>
              <SkeletonExpo
                colorMode="light"
                height={80}
                disableExitAnimation={true}
              >
                {huntParticipant &&
                  huntParticipant.map((participant: any, index: any) => (
                    <View key={index} style={[styles.row, { padding: 2 }]}>
                      <Text style={{ width: 80 }}>
                        <FontAwesomeIcon
                          icon={faUser}
                          size={20}
                          color={"black"}
                        />
                      </Text>
                      <Text style={styles.cell}>{participant.displayName}</Text>
                      <Text style={[styles.cell, { textAlign: "center" }]}>
                        {participant.role}
                      </Text>
                    </View>
                  ))}
              </SkeletonExpo>
            </View>
          </View>
        </>
      </SkeletonExpo>
    </View>
  );
}

export default React.memo(HuntingParticipant);

const style = (huntSession: any) =>
  StyleSheet.create({
    cardContainer: {
      padding: huntSession ? 15 : 0,
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
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    cell: {
      flex: 1,
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
    text: {
      color: "black",
      fontSize: 16,
      fontWeight: "500",
    },
  });
