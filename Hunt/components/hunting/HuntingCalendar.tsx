import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Calendar, CalendarList } from "react-native-calendars";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

import { LocaleConfig } from "react-native-calendars";
import HuntingSessionService from "../../service/huntingSessionService";

LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avr.",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

export interface IHuntingSessionModel {
  fromDate: Date;
  toDate: Date;
}

function HuntingCalendar({
  closeModal,
  isModalVisible,
  history,
  fetchHistoryHunting,
}: any) {
  const [firstDate, setFirstDate] = useState("");
  const [secondDate, setSecondDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [markedDates, setMarkedDates] = useState({});

  const onDayPress = useCallback((day: any) => {
    if (!firstDate || secondDate) {
      setFirstDate(day.dateString);
      const nextDay = new Date(day.timestamp);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().split("T")[0];
      setSecondDate(nextDayString);
    } else {
      setSecondDate(day.dateString);
    }
  }, []);

  const isDateInSessions = useCallback((date: any, sessions: any) => {
    return sessions.some((session: any) => {
      const start = new Date(session.fromDate).toISOString().split("T")[0];
      const checkDate = new Date(date).toISOString().split("T")[0];
      return checkDate == start;
    });
  }, []);

  const theme = useMemo(
    () =>
      ({
        backgroundColor: "#ffffff",
        calendarBackground: "#ffffff",
        todayTextColor: "#ff0000",
        dayTextColor: "#2d4150",
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
        marginBottom: 7,
        "stylesheet.calendar": {},
        "stylesheet.calendar.header": {
          dayHeader: {
            marginTop: 2,
            marginBottom: 7,
            width: 32,
            textAlign: "center",
            color: "black",
          },

          week: {
            marginTop: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            color: "red",
          },
        },
      } as any),
    []
  );

  useEffect(() => {
    if (firstDate && secondDate) {
      setMarkedDates((prevMarkedDates: any) => {
        const newMarkedDates: any = { ...prevMarkedDates };

        Object.keys(prevMarkedDates).forEach((date) => {
          if (prevMarkedDates[date].color === "green") {
            if (!isDateInSessions(date, history)) {
              newMarkedDates[date] = { disabled: true, textColor: "#e5e5e5" };
            } else {
              newMarkedDates[date] = {};
            }
          }
        });
        newMarkedDates[firstDate] = {
          startingDay: true,
          color: "green",
          textColor: "white",
        };
        newMarkedDates[secondDate] = {
          endingDay: true,
          color: "green",
          textColor: "white",
        };

        return newMarkedDates;
      });
    }
  }, [firstDate, secondDate]);

  useEffect(() => {
    const sessions = history;
    const newMarkedDates: any = {};
    sessions.forEach((session: { id: number; fromDate: Date }) => {
      const startStr = session.fromDate.toISOString().split("T")[0];
      newMarkedDates[startStr] = {};
    });

    let start = new Date();
    let end = new Date();
    start.setFullYear(start.getFullYear() - 1);
    while (start <= end) {
      const dateString = start.toISOString().split("T")[0];
      if (!newMarkedDates[dateString]) {
        newMarkedDates[dateString] = {
          disabled: true,
          disableTouchEvent: true,
          textColor: "#e5e5e5",
          dotColor: "gray",
        };
      }
      start.setDate(start.getDate() + 1);
    }

    start = new Date();
    end = new Date();
    start.setDate(start.getDate() + 1);
    end.setDate(start.getDate() + 31);
    while (start <= end) {
      const dateString = start.toISOString().split("T")[0];
      if (!newMarkedDates[dateString]) {
        newMarkedDates[dateString] = {
          disabled: true,
          disableTouchEvent: true,
          textColor: "#e5e5e5",
          dotColor: "gray",
        };
      }
      start.setDate(start.getDate() + 1);
    }

    setMarkedDates(newMarkedDates);
  }, [history]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.shadowWrapper}>
        <View style={styles.container}>
          <View
            style={{
              paddingHorizontal: 10,
              borderWidth: 1,
              borderBottomWidth: 3,
              borderRightWidth: 3,
              borderRadius: 15,
            }}
          >
            <CalendarList
              horizontal={true}
              onDayPress={(day) => onDayPress(day)}
              markingType={"period"}
              markedDates={markedDates}
              futureScrollRange={0}
              pastScrollRange={24}
              theme={theme}
            />
          </View>

          <Text style={{ color: "red", paddingVertical: 10, fontSize: 14 }}>
            {errorMessage}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                closeModal();
              }}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderBottomWidth: 4,
                borderRightWidth: 4,
                alignItems: "center",
                justifyContent: "center",
                width: 120,
                height: 40,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "800" }}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                if (firstDate === "" || secondDate === "")
                  setErrorMessage("Error");
                const sessionWithDate = history.find(
                  (value: any) =>
                    value.fromDate.toISOString().split("T")[0] === firstDate
                );
                fetchHistoryHunting(sessionWithDate.id);
                closeModal();
              }}
              style={{
                borderWidth: 1,
                borderBottomWidth: 4,
                borderRightWidth: 4,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                width: 120,
                height: 40,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "800" }}>Suivant</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default React.memo(HuntingCalendar);

const styles = StyleSheet.create({
  shadowWrapper: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    marginTop: 70,
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },

  selectedDateText: {
    marginTop: 20,
    fontSize: 16,
  },
});
