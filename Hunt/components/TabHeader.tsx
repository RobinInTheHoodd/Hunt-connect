import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { faBars } from "@fortawesome/free-solid-svg-icons";

const TabHeader: React.FC<any> = ({ openDrawer }: any) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <FontAwesomeIcon icon={faBars} size={25} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 90,
    paddingTop: 30,
  },
  menuButton: {
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    marginLeft: 10,
    paddingVertical: 10,
    backgroundColor: "grey",
    borderRadius: 30,
    opacity: 0.9,
  },
});
export default TabHeader;
