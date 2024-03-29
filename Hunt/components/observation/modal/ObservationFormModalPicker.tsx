import {
  faArrowDown,
  faArrowUp,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IHuntingParticipanModel } from "../../../model/HuntingParticipantModel";

const ObservationFormPicker = ({
  items,
  onItemSelect,
  title,
  iconLeft,
  toggleOpen,
  isOpen,
  removePicker,
}: any) => {
  useEffect(() => {}, [items]);
  const { height, width } = useWindowDimensions();
  return (
    <View style={{ flex: 1 }}>
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
            justifyContent: "center",
            paddingLeft: 10,
            paddingVertical: 13,
            borderRadius: 10,
            borderWidth: 1,
            borderBottomWidth: 4,
            borderRightWidth: 4,
            borderColor: "black",
            marginBottom: height * 0.01,
            marginTop: 5,
            paddingHorizontal: 10,
            backgroundColor: "#FFF",
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
              <Text style={{ fontWeight: "500", fontSize: width * 0.043 }}>
                {title}
              </Text>
            </View>
            <FontAwesomeIcon icon={isOpen ? faArrowDown : faArrowUp} />
          </View>
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 10,
            padding: 3,
            backgroundColor: "#FFF",
            maxHeight: 150,
            zIndex: 10,
          }}
        >
          <ScrollView
            nestedScrollEnabled={true}
            onScrollBeginDrag={(e) => e.stopPropagation()}
          >
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
export default ObservationFormPicker;
