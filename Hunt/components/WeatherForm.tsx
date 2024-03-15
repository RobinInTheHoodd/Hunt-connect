import {
  faTemperature3,
  faDroplet,
  faCloudSun,
  faWind,
  faCompass,
  faTools,
  faGears,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  IWeatherFormModel,
  WeatherFormModel,
} from "../model/form/WeatherFormModel";
import InputText from "./Input/InputText";
import { ScrollView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import weatherService from "../service/weather/weatherService";
import WeatherInfoModel from "../model/WeatherModel";
import WeatherService from "../service/weather/weatherService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export interface IWeatherFormProps {
  form: WeatherFormModel;
  setForm: React.Dispatch<React.SetStateAction<IWeatherFormModel>>;
}

const WeatherForm = ({ form, setForm }: IWeatherFormProps) => {
  const { height, width } = useWindowDimensions();
  const [isFetchWeather, setFetchWeather] = useState(false);
  const weatherService = new WeatherService();
  useEffect(() => {}, [form, setForm]);

  useEffect(() => {
    const fetchWeather = async () => {
      console.log("WEATHER!!!!!!!!!");
      await getWeather();
      setFetchWeather(false);
    };

    if (isFetchWeather) fetchWeather();
  }, [isFetchWeather]);

  const getWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    console.log("bonj");
    let location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude.toString();
    const longitude = location.coords.longitude.toString();

    const weatherData: WeatherInfoModel =
      await weatherService.getWeatherByLocation(latitude, longitude);

    const weatherForm = WeatherFormModel.fromWeatherModel(weatherData);
    setForm(weatherForm);
  };

  return (
    <ScrollView>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: width * 0.07,
            fontWeight: "bold",
            marginVertical: 20,
          }}
        >
          Données météorologique
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
      >
        <View style={{ width: "45%" }}>
          <InputText
            tagName={"Température"}
            value={form.tempC != null ? form.tempC.toString() : ""}
            onChangeText={(value) => {
              const rs = WeatherFormModel.setTempC(value, form);
              setForm(rs);
            }}
            onBlur={() => {}}
            placeholder="Température"
            iconName={faTemperature3}
            isTouched={form.tempCTouched!}
            isValid={form.isTempCValid!}
            errorMessage={form.tempCError!}
            require={true}
            isPassword={false}
            styles={InputTextStyle(
              width,
              height,
              form.isTempCValid,
              form.tempCTouched
            )}
          />
        </View>
        <View style={{ width: "45%" }}>
          <InputText
            tagName={"Humidité"}
            value={form.humidity?.toString()}
            onChangeText={(value) => {
              const rs = WeatherFormModel.sethumidity(value, form);
              setForm(rs);
            }}
            onBlur={() => {}}
            placeholder="Humidité"
            iconName={faDroplet}
            isTouched={form.humidityTouched!}
            isValid={form.isHumidityValid!}
            errorMessage={form.humidityError!}
            require={true}
            isPassword={false}
            styles={InputTextStyle(
              width,
              height,
              form.isHumidityValid,
              form.humidityTouched
            )}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <InputText
          tagName={"Conditions climatique"}
          value={form.conditionText}
          onChangeText={(value) => {
            const rs = WeatherFormModel.setConditionText(value, form);
            setForm(rs);
          }}
          onBlur={() => {}}
          placeholder="nuageux"
          iconName={faCloudSun}
          isTouched={form.conditionTextTouched!}
          isValid={form.isConditionTextValid!}
          errorMessage={form.conditionTextError!}
          require={true}
          isPassword={false}
          styles={InputTextStyle(
            width,
            height,
            form.isConditionTextValid,
            form.conditionTextTouched
          )}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "45%" }}>
          <InputText
            tagName={"Vitesse du vent"}
            value={form.windKph?.toString()}
            onChangeText={(value) => {
              const rs = WeatherFormModel.setwindKph(value, form);
              setForm(rs);
            }}
            onBlur={() => {}}
            placeholder="0%"
            iconName={faWind}
            isTouched={form.windKphTouched!}
            isValid={form.isWindKphValid!}
            errorMessage={form.windKphError!}
            require={true}
            isPassword={false}
            styles={InputTextStyle(
              width,
              height,
              form.isWindKphValid,
              form.windKphTouched
            )}
          />
        </View>
        {/* TODO DROP LIST POUR DIRECTION */}
        <View style={{ width: "45%" }}>
          <InputText
            tagName={"Direction du vent"}
            value={form.windDir}
            onChangeText={(value) => {
              const rs = WeatherFormModel.setwindDir(value, form);
              setForm(rs);
            }}
            onBlur={() => {}}
            placeholder="Humidité"
            iconName={faCompass}
            isTouched={form.windDirTouched!}
            isValid={form.isWindDirValid!}
            errorMessage={form.windDirError!}
            require={true}
            isPassword={false}
            styles={InputTextStyle(
              width,
              height,
              form.isWindDirValid,
              form.windDirTouched
            )}
          />
        </View>
      </View>

      <View style={{ alignItems: "center", marginTop: 30 }}>
        <TouchableOpacity
          onPress={() => setFetchWeather(true)}
          style={{
            borderWidth: 1,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            width: 250,
            height: 50,
          }}
        >
          <FontAwesomeIcon icon={faGear} />
          <Text style={{ fontSize: 15, fontWeight: "800" }}>
            Remplissage automatique
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const InputTextStyle = (
  width: number,
  height: number,
  isValid: boolean,
  isTouched: boolean
) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: !isTouched ? "#ccc" : isValid ? "green" : "red",
      marginBottom: height * 0.01,
      paddingHorizontal: 10,
    },
    invalidInput: {
      borderBottomColor: "red",
    },
    validInput: {
      borderBottomColor: "green",
    },
    inputTag: {
      color: "green",
      fontWeight: "bold",
      fontSize: width * 0.04,
    },
    input: {
      flex: 1,
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.02,
    },
    icon: {
      marginRight: 10,
    },
    errorMessage: {
      color: "red",
      fontSize: 14,
    },
  });

export default WeatherForm;
