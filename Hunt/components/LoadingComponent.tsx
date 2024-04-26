import LottieView from "lottie-react-native";
import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import LoadingAnim from "../assets/Duck .json";

interface LoadingComponentProp {
  visible: boolean;
}

const LoadingComponent: React.FC<LoadingComponentProp> = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={visible}
      onRequestClose={() => {
        console.log("Fermeture du modal de chargement");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <LottieView
            source={LoadingAnim}
            autoPlay={true}
            loop={true}
            resizeMode="cover"
            style={{ height: 150, width: 150 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "rgba(0,0,0,0.5)", // Assombrir légèrement le fond
  },
  modalView: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
});

export default LoadingComponent;
