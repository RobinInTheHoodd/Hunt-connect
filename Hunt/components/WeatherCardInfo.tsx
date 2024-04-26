import { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import WeatherInfoModel, { IWeatherInfoModel } from "../model/WeatherModel";
import WeatherService from "../service/weather/weatherService";
import { faWind, faDroplet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const WeatherCardInfo = ({ navigation, weather }: any) => {
  const weatherService = new WeatherService();
  const [weatherData, setWeatherData] = useState<WeatherInfoModel>();
  const monthNames = [
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
  ];
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setDate(midnight.getDate() + 1);
      midnight.setHours(0, 0, 0, 0);
      return midnight.getTime() - now.getTime();
    };

    const timer = setTimeout(() => {
      setCurrentDate(new Date());
    }, timeUntilMidnight());

    return () => clearTimeout(timer);
  }, [currentDate]);

  return (
    <View style={styles.cardContainer}>
      <Image
        source={require("../assets/maps.png")}
        style={[styles.backgroundImage]}
      />
      <Text style={styles.dateText}>
        Aujourd'hui, {currentDate.getDate()}{" "}
        {monthNames[currentDate.getMonth()]}
      </Text>
      <Text style={styles.weatherDescription}>{weather.conditionText}</Text>
      <View style={[styles.row, { marginBottom: 0 }]}>
        <Text style={styles.temperatureText}>
          {weather.tempC == undefined ? 5 : weather.tempC + "°"}
        </Text>
      </View>

      <View style={[styles.row, { marginTop: 5 }]}>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>{"Vitesse du vent"}</Text>
          <Text style={styles.detailValue}>
            <FontAwesomeIcon icon={faWind} /> {weather.windKph + " km/h"}
          </Text>
          <Text style={styles.detailText}>{weather.windDir}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>{"Humidité"}</Text>
          <Text style={styles.detailValue}>
            <FontAwesomeIcon icon={faDroplet} /> {weather.humidity}
            {" %"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: 350,

    borderWidth: 1,
    borderBottomWidth: 3,
    borderRightWidth: 3,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 350,
    height: 252,
    opacity: 0.2,
  },
  dateText: {
    color: "black",
    fontSize: 18,
  },
  weatherDescription: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  temperatureText: {
    color: "black",
    fontSize: 64,
    fontWeight: "bold",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  temperatureRangeText: {
    alignSelf: "flex-end",
    color: "black",
    fontSize: 18,
  },
  detailItem: {
    marginBottom: 5,
  },
  detailText: {
    color: "black",
    fontSize: 16,
  },
  detailValue: {
    marginTop: 5,
    marginLeft: 5,
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default WeatherCardInfo;
