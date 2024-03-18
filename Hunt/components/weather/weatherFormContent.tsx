import {
  faTemperature3,
  faDroplet,
  faCloudSun,
  faWind,
  faCompass,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { WeatherFormModel } from "../../model/form/WeatherFormModel";
import InputText from "../Input/InputText";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import WeatherService from "../../service/weather/weatherService";
import WeatherInfoModel from "../../model/WeatherModel";
import * as Location from "expo-location";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IWeatherFormProps } from "./weatherForm";

export default function WeatherFormContent({
  form,
  setForm,
}: IWeatherFormProps) {
  const { height, width } = useWindowDimensions();
  const [isFetchWeather, setFetchWeather] = useState(false);
  const weatherService = new WeatherService();

  const getWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude.toString();
    const longitude = location.coords.longitude.toString();

    const weatherData: WeatherInfoModel =
      await weatherService.getWeatherByLocation(latitude, longitude);

    const weatherForm = WeatherFormModel.fromWeatherModel(weatherData);
    setForm(weatherForm);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      await getWeather();
      setFetchWeather(false);
    };

    if (isFetchWeather) fetchWeather();
  }, [isFetchWeather]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {}, [keyboardHeight]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 70 }}
    >
      <View style={{ marginBottom: keyboardHeight }}>
        <InputText
          tagName={"Température"}
          value={form.tempC != null ? form.tempC.toString() : ""}
          onChangeText={(value) => {
            let number;
            if (value != "") {
              number = parseInt(value);
            } else number = value;
            const rs = WeatherFormModel.setTempC(number, form);
            setForm(rs);
          }}
          onBlur={() => {}}
          placeholder="0°"
          iconName={faTemperature3}
          isTouched={form.tempCTouched!}
          isValid={form.isTempCValid!}
          errorMessage={form.tempCError!}
          require={true}
          isPassword={false}
          keyboard="numeric"
          styles={InputTextStyle(
            width,
            height,
            form.isTempCValid,
            form.tempCTouched
          )}
        />

        <InputText
          tagName={"Humidité"}
          value={form.humidity?.toString()}
          onChangeText={(value) => {
            let number;
            if (value != "") {
              number = parseInt(value);
            } else number = value;
            const rs = WeatherFormModel.sethumidity(number, form);
            setForm(rs);
          }}
          onBlur={() => {}}
          placeholder="0%"
          iconName={faDroplet}
          isTouched={form.humidityTouched!}
          isValid={form.isHumidityValid!}
          errorMessage={form.humidityError!}
          require={true}
          isPassword={false}
          keyboard="numeric"
          styles={InputTextStyle(
            width,
            height,
            form.isHumidityValid,
            form.humidityTouched
          )}
        />

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
        <InputText
          tagName={"Vitesse du vent"}
          value={form.windKph?.toString()}
          onChangeText={(value) => {
            let number;
            if (value != "") {
              number = parseInt(value);
            } else number = value;
            const rs = WeatherFormModel.setwindKph(number, form);
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
          keyboard="numeric"
          styles={InputTextStyle(
            width,
            height,
            form.isWindKphValid,
            form.windKphTouched
          )}
        />
        <InputText
          tagName={"Direction du vent"}
          value={form.windDir}
          onChangeText={(value) => {
            const rs = WeatherFormModel.setwindDir(value, form);
            setForm(rs);
          }}
          onBlur={() => {}}
          placeholder="Nord"
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

        <ButtonAutoLoad setFetchWeather={setFetchWeather} />
      </View>
    </ScrollView>
  );
}
interface IButtonLoadWeatherFormProps {
  setFetchWeather: Dispatch<SetStateAction<boolean>>;
}
const ButtonAutoLoad: React.FC<IButtonLoadWeatherFormProps> = ({
  setFetchWeather,
}) => {
  return (
    <View style={{ alignItems: "center", marginTop: 10 }}>
      <TouchableOpacity
        onPress={() => {
          //let rs = WeatherFormModel.isValidForm(form);
          //setForm(rs);
          setFetchWeather(true);
        }}
        style={{
          borderWidth: 1,

          borderBottomWidth: 5,
          borderRightWidth: 5,
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
  );
};

const InputTextStyle = (
  width: number,
  height: number,
  isValid: boolean,
  isTouched: boolean
) =>
  StyleSheet.create({
    container: {
      paddingVertical: 4,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderColor: "black",
      marginBottom: height * 0.01,
      marginTop: 5,
      paddingHorizontal: 10,
    },
    invalidInput: {
      borderBottomColor: "red",
    },
    validInput: {
      borderBottomColor: "green",
    },
    inputTag: {
      color: "#38761d",
      fontWeight: "bold",
      fontSize: width * 0.05,
    },
    input: {
      flex: 1,
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.008,
      fontWeight: "bold",
      fontSize: width * 0.045,
      color: "black", //!isTouched ? "black" : isValid ? "green" : "red",
    },
    icon: {
      marginRight: 10,
    },
    errorMessage: {
      color: "red",
      fontSize: 14,
    },
  });
