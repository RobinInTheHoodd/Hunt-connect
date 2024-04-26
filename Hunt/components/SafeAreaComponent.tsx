import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

const SafeAreaComponent = ({ children }: any) => (
  <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default SafeAreaComponent;
