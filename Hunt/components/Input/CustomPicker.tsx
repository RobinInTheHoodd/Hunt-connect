import {
  faArrowDown,
  faArrowUp,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IHuntingParticipanModel } from "../../model/HuntingParticipantModel";

const MyCustomPicker = ({
  items,
  onItemSelect,
  title,
  iconLeft,
  toggleOpen,
  isOpen,
  removePicker,
}: any) => {
  useEffect(() => {}, [items]);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={toggleOpen}
          style={{
            flex: 1,
            borderWidth: 1,
            borderBottomWidth: 4,
            borderRightWidth: 4,
            borderRadius: 10,
            paddingVertical: 15,
            justifyContent: "center",
            paddingLeft: 10,
            backgroundColor: "#FFF", // Fond blanc pour le sélecteur
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={iconLeft} />
              <Text>{title}</Text>
            </View>
            <FontAwesomeIcon icon={isOpen ? faArrowDown : faArrowUp} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={removePicker}
          style={{ padding: 15, marginRight: 3 }}
        >
          <FontAwesomeIcon icon={faTrash} size={20} color="#970808" />
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View
          style={{
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 10,
            padding: 3,
            marginTop: 5,
            backgroundColor: "#FFF",
            height: 150,
          }}
        >
          <ScrollView>
            {items.map((item: IHuntingParticipanModel) => (
              <TouchableOpacity
                key={item.displayName}
                onPress={() => onItemSelect(item)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,

                  borderBottomWidth: 1,
                  borderBottomColor: "black",
                  backgroundColor: "#FFF",
                }}
              >
                <Text>{item.displayName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
export default MyCustomPicker;
