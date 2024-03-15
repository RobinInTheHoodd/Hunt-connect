import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMoon,
  faArrowTrendUp,
  faCrow,
  faMapLocationDot,
  faChevronLeft,
  faPaperclip,
  faChartLine,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [activeTab, setActiveTab] = useState("All");
  const [filterPeriod, setFilterPeriod] = useState("Février - Mars");
  const [modalVisible, setModalVisible] = useState(false);

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
        <ImageBackground
          source={require("../../assets/HutteBGHome.jpg")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <Text style={styles.greeting}>Hachette</Text>
        </ImageBackground>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "All" && styles.activeTab]}
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

        <View style={styles.cardsRow}>
          <View style={styles.leftCards}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Moyenne</Text>
              <View style={styles.cardHighlightContainer}>
                <Text style={styles.cardHighlight}>2.8 / Nuit </Text>
                <FontAwesomeIcon
                  icon={faArrowTrendUp}
                  size={30}
                  color={"green"}
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Nuit total</Text>
              <View style={styles.cardHighlightContainer}>
                <Text style={styles.cardHighlight}>10</Text>
                <FontAwesomeIcon icon={faMoon} size={30} color={"blue"} />
              </View>
            </View>
          </View>

          <View style={styles.rightCard}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total espèce</Text>
              <View
                style={[styles.cardHighlightContainer, { marginBottom: 50 }]}
              >
                <Text style={styles.cardHighlight}>230 </Text>
                <FontAwesomeIcon icon={faCrow} size={30} color={"black"} />
              </View>
              <Text style={styles.cardTitle}>Top espèce</Text>
              <Text style={styles.cardContent}>Souchet</Text>
              <Text style={styles.cardHighlight}>134 40 %</Text>
            </View>
          </View>
        </View>
        <View style={styles.centralCard}>
          <View style={styles.card}>
            <View
              style={[
                styles.cardHighlightContainer,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 5,
                  marginTop: 0,
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
            <ImageBackground
              source={require("../../assets/maps.png")}
              resizeMode="cover"
              style={styles.mapsImage}
            />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    alignItems: "center", // Assurez-vous que les enfants sont centrés verticalement
  },
  tabButton: {
    flex: 1, // Prend 1/4 de l'espace disponible
    justifyContent: "center", // Centrer le texte verticalement
    alignItems: "center", // Centrer le texte horizontalement
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  filterPeriod: {
    flex: 2, // Prend 2/4 (la moitié) de l'espace disponible
    fontSize: 16,
    color: "#000",
    textAlign: "center", // Assurez-vous que le texte est centré
  },
  filterButton: {
    flex: 1, // Prend 1/4 de l'espace disponible
    justifyContent: "center", // Centrer l'icône verticalement
    alignItems: "center", // Centrer l'icône horizontalement
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
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftCards: {
    flex: 1,
    marginRight: 10,
  },
  rightCard: {
    flex: 1,
  },
  centralCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#D3D3D0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  cardHighlightContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  cardHighlight: {
    fontSize: 20,
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
