import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMoon, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import HutService from "../../service/hutService";
import HutModel from "../../model/HutModel";
import { UserContext } from "../../model/UserContext";
import SkeletonExpo from "moti/build/skeleton/expo";
import React from "react";
import {
  setLoadingFalse,
  setLoadingTrue,
} from "../../redux/reducers/loadingSlice";
import ObservationFormMap from "../../components/observation/ObservationFormMap";
import HuntingHeader from "../../components/hunting/screen/HuntingHeader";

export default function Acceuil({ navigation }: any) {
  const user: UserContext = useAppSelector((state) => state.users);
  const hut: HutModel = useAppSelector((state) => state.hut!);
  const obs = useAppSelector((state) => state.observation);
  const isLoading = useAppSelector((state) => state.isLoading);
  const dispatch = useAppDispatch();

  const hutService = new HutService();

  const [countNight, setCountNight] = useState(0);
  const [averageKill, setAverageKill] = useState(0);
  const [averageView, setAverageView] = useState(0);
  const [totalKill, setTotalKill] = useState(0);
  const [totalView, setTotalView] = useState(0);
  const [specimenPosition, setSpecimenPosition] = useState([]);
  const [percentageKillSpecimen, setPercentageKillSpecimen] = useState({});
  const [percentageViewSpecimen, setPercentageViewSpecimen] = useState<{
    [key: string]: {
      quantityKill: number;
      quantityView: number;
      killPercentage?: number;
      viewPercentage?: number;
    };
  }>({});

  const [activeTab, setActiveTab] = useState("All");
  const [filterPeriod, setFilterPeriod] = useState("Février - Mars");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCountHunt = async () => {
      let count = 0;
      let averageKill = 0;
      let averageView = 0;
      let totalKill = 0;
      let totalView = 0;
      let percentage = {};
      let specimentPos: any = [];

      try {
        if (user || hut) {
          count = await hutService.getCountHuntSession(
            hut.id!.toString(),
            user.UIID
          );

          averageKill = await hutService.getAverageKillByNight(
            hut.id!.toString(),
            user.UIID
          );

          averageView = await hutService.getAverageViewByNight(
            hut.id!.toString(),
            user.UIID
          );

          totalKill = await hutService.getTotalKill(
            hut.id!.toString(),
            user.UIID
          );

          totalView = await hutService.getTotalView(
            hut.id!.toString(),
            user.UIID
          );

          percentage = await hutService.getTopSpecimen(
            hut.id!.toString(),
            user.UIID
          );

          specimentPos = await hutService.getSpecimenPosition(
            hut.id!.toString(),
            user.UIID
          );

          setCountNight(count);
          setAverageKill(averageKill);
          setAverageView(averageView);
          setTotalKill(totalKill);
          setTotalView(totalView);
          setSpecimenPosition(specimentPos);

          let topKillSpecimen = {};
          let topViewSpecimen = {};
          let maxKillPercentage = 0;
          let maxViewPercentage = 0;

          Object.entries(percentage).forEach(([specimen, data]: any) => {
            if (data.killPercentage > maxKillPercentage) {
              maxKillPercentage = data.killPercentage;
              topKillSpecimen = { [specimen]: data };
            }
            if (data.viewPercentage > maxViewPercentage) {
              maxViewPercentage = data.viewPercentage;
              topViewSpecimen = { [specimen]: data };
            }
          });

          setPercentageKillSpecimen(topKillSpecimen);
          setPercentageViewSpecimen(topViewSpecimen);
        }
      } catch (e) {
        setPercentageKillSpecimen({});
        setPercentageViewSpecimen({});
      } finally {
        dispatch(setLoadingFalse());
      }
    };
    if (hut) {
      dispatch(setLoadingTrue());
      fetchCountHunt();
    }
  }, [hut, obs]);

  const resetFilters = () => {
    setFilterPeriod("Février - Mars");
    setActiveTab("All");
  };

  const openFilterModal = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <SkeletonExpo.Group show={isLoading}>
          <HuntingHeader
            navigation={navigation}
            openModal={() => {}}
            title={hut ? hut.hut_name : ""}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <View style={[{ justifyContent: "flex-start", gap: 10 }]}>
              <View style={[styles.borderCard, { flex: 1 }]}>
                <SkeletonExpo
                  colorMode="light"
                  disableExitAnimation={true}
                  boxHeight={"100%"}
                >
                  <View style={[styles.cardContainer]}>
                    <Text style={styles.cardTitle}>Moyenne</Text>
                    <View style={styles.cardHighlightContainer}>
                      <Text style={styles.cardHighlight}>
                        {" "}
                        {averageView}
                        {"  "}
                        <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                          Vues / Nuit{" "}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.cardHighlightContainer}>
                      <Text style={styles.cardHighlight}>
                        {" "}
                        {averageKill}
                        {"  "}
                        <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                          Tués / Nuit{" "}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </SkeletonExpo>
              </View>

              <View style={[styles.borderCard, { flex: 1 }]}>
                <SkeletonExpo
                  colorMode="light"
                  disableExitAnimation={true}
                  boxHeight={"100%"}
                >
                  <View style={[styles.cardContainer]}>
                    <Text style={styles.cardTitle}>Nuit total</Text>
                    <View style={styles.cardHighlightContainer}>
                      <Text style={styles.cardHighlight}>
                        {countNight}
                        {"        "}
                      </Text>
                      <FontAwesomeIcon icon={faMoon} size={30} color={"blue"} />
                    </View>
                  </View>
                </SkeletonExpo>
              </View>
            </View>

            <View style={[styles.borderCard, { flex: 1 }]}>
              <SkeletonExpo colorMode="light" disableExitAnimation={true}>
                <View style={styles.cardContainer}>
                  <View>
                    <View style={{ marginBottom: 10 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#34651e",
                        }}
                      >
                        Vue
                      </Text>
                      <View style={{ marginTop: 5 }}>
                        <Text style={[styles.cardText]}>
                          Total : {totalView}{" "}
                        </Text>
                        <Text style={styles.cardText}>
                          Top :{" "}
                          {(Object.keys(percentageViewSpecimen)[0] &&
                            Object.keys(percentageViewSpecimen)[0]) ||
                            ""}
                        </Text>
                        <Text style={styles.cardText}>
                          {(Object.keys(percentageViewSpecimen)[0] &&
                            percentageViewSpecimen[
                              Object.keys(percentageViewSpecimen)[0]
                            ].quantityView) ||
                            "0"}{" "}
                          Vue
                          {"   -   "}
                          {(Object.keys(percentageViewSpecimen)[0] &&
                            percentageViewSpecimen[
                              Object.keys(percentageViewSpecimen)[0]
                            ].viewPercentage.toFixed(2)) ||
                            "0"}
                          %
                        </Text>
                      </View>
                    </View>

                    <View style={{ borderWidth: 0.5 }} />

                    <View style={{ marginTop: 10 }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#34651e",
                          }}
                        >
                          Tué
                        </Text>
                      </View>
                      <View style={{ marginTop: 5 }}>
                        <Text style={styles.cardText}>
                          Total : {totalKill}{" "}
                        </Text>
                        <Text style={styles.cardText}>
                          Top :{" "}
                          {percentageKillSpecimen &&
                            Object.keys(percentageKillSpecimen)[0]}
                        </Text>
                        <Text style={styles.cardText}>
                          {(Object.keys(percentageKillSpecimen)[0] &&
                            percentageKillSpecimen[
                              Object.keys(percentageKillSpecimen)[0]
                            ].quantityKill) ||
                            "0"}
                          {"   -   "}
                          {(Object.keys(percentageKillSpecimen)[0] &&
                            percentageKillSpecimen[
                              Object.keys(percentageKillSpecimen)[0]
                            ].killPercentage.toFixed(2)) ||
                            "0"}
                          %
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </SkeletonExpo>
            </View>
          </View>

          <View style={[styles.centralCard, { flex: 1, marginTop: 10 }]}>
            <View style={[styles.borderCard]}>
              <SkeletonExpo colorMode="light" disableExitAnimation={true}>
                <>
                  <View
                    style={[
                      styles.cardHighlightContainer,
                      {
                        width: "100%",
                        borderBottomWidth: 1,
                        padding: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <Text style={styles.cardTitle}>Position des espèces </Text>
                    <FontAwesomeIcon
                      icon={faMapLocationDot}
                      size={30}
                      color={"black"}
                    />
                  </View>
                  <View
                    style={{
                      height: 250,
                      borderBottomRightRadius: 8,
                      borderBottomLeftRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <ObservationFormMap form={specimenPosition} />
                  </View>
                </>
              </SkeletonExpo>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Select Filter Options</Text>

                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </SkeletonExpo.Group>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    padding: 15,
  },
  backgroundImage: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 70,
    borderRadius: 20,
  },
  mapsImage: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 90,
  },
  greeting: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
    textAlign: "center",
  },
  summary: {
    fontSize: 20,
    color: "black",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ECECEC",
    borderRadius: 20,
    margin: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  filterPeriod: {
    flex: 2,
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  filterButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  activeTab: {
    backgroundColor: "#DAA520",
    borderRadius: 20,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  centralCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    //paddingHorizontal: 15,
  },
  cardText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
    alignItems: "center",
    margin: 5,
  },
  borderCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  cardContainer: {
    backgroundColor: "#EEEEEE",
    borderRadius: 8,
    padding: 15,
    flex: 1,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34651e",

    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  cardHighlightContainer: {
    flexDirection: "row",
  },
  cardHighlight: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

/**
 <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "All" && styles.activeTab,
              ]}
              onPress={resetFilters}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "All" && styles.activeTabText,
                ]}
              >
                {"All"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.filterPeriod}>{filterPeriod}</Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={openFilterModal}
            >
              <FontAwesomeIcon icon={faFilter} size={20} color="black" />
            </TouchableOpacity>
          </View>
 */
