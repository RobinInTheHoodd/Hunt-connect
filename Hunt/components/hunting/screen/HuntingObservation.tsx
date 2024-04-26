import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import ObservationModel from "../../../model/form/ObservationModel";
import { useAppSelector } from "../../../redux/hook";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React from "react";
import SkeletonExpo from "moti/build/skeleton/expo";

function HuntingObservation({ navigation, huntSession, observations }: any) {
  const styles = style(huntSession);
  const isLoading = useAppSelector((state) => state.isLoading);

  const sortedObservations = useMemo(() => {
    if (observations === undefined) return;
    if (Array.isArray(observations)) {
      return observations.slice().sort((a: any, b: any) => {
        const dateA = new Date(a.viewDate);
        const dateB = new Date(b.viewDate);
        return dateB.getTime() - dateA.getTime();
      });
    }
    return [];
  }, [observations]);

  const totalKill = useCallback(() => {
    if (observations === undefined) return;
    let total: number = 0;

    if (Array.isArray(observations)) {
      observations.forEach((observation: ObservationModel) => {
        total += observation.quantityKill;
      });
    }
    return total.toString();
  }, [observations]);

  const totalView = useCallback(() => {
    if (observations === undefined) return;
    let total: number = 0;
    if (Array.isArray(observations)) {
      observations.forEach((observation: ObservationModel) => {
        total += observation.quantityView;
      });
    }
    return total.toString();
  }, [observations]);

  const specimenDom = useCallback(() => {
    if (observations === undefined) return;
    if (Array.isArray(observations)) {
      const specimenCounts = observations.reduce(
        (
          acc: Record<
            string,
            {
              count: number;
              totalViews: number;
            }
          >,
          observation: any
        ) => {
          const { specimen, quantityView } = observation;
          if (!acc[specimen]) {
            acc[specimen] = { count: 0, totalViews: 0 };
          }
          acc[specimen].count += 1;
          acc[specimen].totalViews += quantityView;

          return acc;
        },
        {}
      );
      let dominantSpecimen = "";
      let maxTotalViews = 0;
      for (const [specimen, data] of Object.entries(specimenCounts)) {
        const value = data as any;
        if (value.totalViews > maxTotalViews) {
          maxTotalViews = value.totalViews;
          dominantSpecimen = specimen;
        }
      }
      return dominantSpecimen;
    }
  }, [observations]);

  const MemoizedFontAwesomeIcon = React.memo(
    ({ icon, ...props }: any) => {
      return <FontAwesomeIcon icon={icon} {...props} />;
    },
    (prevProps, nextProps) => {
      return (
        prevProps.icon === nextProps.icon && prevProps.style === nextProps.style
      );
    }
  );

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Observation", { huntSession: huntSession })
        }
        style={{}}
        disabled={
          isLoading
            ? true
            : huntSession != null
            ? huntSession.isFinish && sortedObservations!.length == 0
              ? true
              : false
            : true
        }
      >
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
          <SkeletonExpo colorMode="light" disableExitAnimation={true}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#34651e" }}
            >
              Tableau de bord
            </Text>
          </SkeletonExpo>

          <SkeletonExpo
            colorMode="light"
            width={50}
            disableExitAnimation={true}
          >
            {huntSession != null ? (
              huntSession.isFinish === false ? (
                <MemoizedFontAwesomeIcon
                  icon={faPlusCircle}
                  size={20}
                  color={"#34651e"}
                />
              ) : isLoading === true ? (
                <MemoizedFontAwesomeIcon
                  icon={faPlusCircle}
                  size={20}
                  color={"#34651e"}
                />
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </SkeletonExpo>
        </View>

        <View>
          <View style={{ paddingBottom: 5 }}>
            <SkeletonExpo colorMode="light" disableExitAnimation={true}>
              <View style={styles.row}>
                <Text style={[styles.text, styles.cell]}>Éspèce</Text>
                <Text
                  style={[styles.text, styles.cell, { textAlign: "center" }]}
                >
                  Tué / Vue
                </Text>
                <Text
                  style={[styles.text, styles.cell, { textAlign: "center" }]}
                >
                  Heure
                </Text>
                <Text
                  style={[styles.text, styles.cell, { textAlign: "center" }]}
                >
                  Position
                </Text>
              </View>
            </SkeletonExpo>
          </View>
          <SkeletonExpo
            colorMode="light"
            height={90}
            disableExitAnimation={true}
          >
            <>
              {sortedObservations && (
                <>
                  {sortedObservations.length == 0 ? (
                    <>
                      <View key={0} style={[styles.row, { padding: 2 }]}>
                        <Text style={styles.cell}>/</Text>
                        <Text style={[styles.cell, { textAlign: "center" }]}>
                          -/-
                        </Text>
                        <Text style={[styles.cell, { textAlign: "center" }]}>
                          /
                        </Text>

                        <Text style={[styles.cell, { textAlign: "center" }]}>
                          /
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      {sortedObservations
                        .slice(0, 4)
                        .map((value: ObservationModel, index: number) => (
                          <View
                            key={index}
                            style={[styles.row, { padding: 2 }]}
                          >
                            <Text style={styles.cell}>{value.specimen}</Text>
                            <Text
                              style={[styles.cell, { textAlign: "center" }]}
                            >
                              {value.quantityKill}/{value.quantityView}
                            </Text>
                            <Text
                              style={[styles.cell, { textAlign: "center" }]}
                            >
                              {new Date(value.viewDate).toLocaleTimeString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Text>

                            <Text
                              style={[styles.cell, { textAlign: "center" }]}
                            >
                              {value.isInFlight ? "Vol" : "Pose"}
                            </Text>
                          </View>
                        ))}
                    </>
                  )}
                </>
              )}
            </>
          </SkeletonExpo>
        </View>

        <View style={[styles.row, { paddingTop: 8 }]}>
          <View style={[styles.halfCardContainer]}>
            <SkeletonExpo
              colorMode="light"
              width={90}
              disableExitAnimation={true}
            >
              <Text style={styles.text}>
                {huntSession && "Total :  " + totalKill() + "/" + totalView()}
              </Text>
            </SkeletonExpo>
          </View>

          <View style={[styles.halfCardContainer]}>
            <SkeletonExpo colorMode="light" disableExitAnimation={true}>
              <Text style={styles.text}>
                {huntSession && "Dominante : " + specimenDom()}
              </Text>
            </SkeletonExpo>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(HuntingObservation);

const style = (huntSession: any) =>
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
    cell: {
      flex: 1,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    halfCardContainer: {
      width: "48%",
    },
    text: {
      color: "black",
      fontSize: 16,
      fontWeight: "500",
    },
  });
