import { useState } from "react";

import {
  Platform,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Text,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ObservationFormTimeDateModel from "../../../model/observation/ObservationFormTimeDateModel";
import ObservationForm from "../../../model/observation/ObservationForm";

interface IObservationFormTimeDatePickerProps {
  date: Date;
  setDate: (type: string, date: Date) => void;
  text: string;
}
export default function ObservationFormTimeDatePicker({
  date,
  setDate,
  text,
}: IObservationFormTimeDatePickerProps) {
  const { height, width } = useWindowDimensions();
  const [mode, setMode] = useState("date");
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === "ios");
    setDate(text, currentDate);
    if (Platform.OS !== "ios") {
      setShowTime(true);
    }
  };

  const onChangeTime = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || date;
    setShowTime(Platform.OS === "ios");
    setDate(text, currentTime);
  };

  const showDateTimePicker = () => {
    setShowDate(true);
  };

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <>
      <View
        style={{
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Text
          style={{
            color: "#38761d",
            fontWeight: "bold",
            fontSize: width * 0.05,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {text}
        </Text>
        <TouchableOpacity
          onPress={showDateTimePicker}
          style={{
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
          <Text
            style={{
              fontWeight: "500",
              fontSize: width * 0.043,
              color: "black",
            }}
          >
            {formattedDate} {formattedTime}
          </Text>
        </TouchableOpacity>
      </View>

      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}
    </>
  );
}
