import {
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import InputText from "./Input/InputText";
import { useEffect, useRef, useState } from "react";
import { ISignUpForm, SignUpForm } from "../model/form/SignUpForm";
import animationData from "../assets/we.json";

import {
  faArrowAltCircleLeft,
  faArrowLeft,
  faCloudSun,
  faCompass,
  faDroplet,
  faTemperature3,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import Carousel from "react-native-reanimated-carousel";

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import React from "react";
import { current } from "@reduxjs/toolkit";
import { WeatherFormModel } from "../model/form/WeatherFormModel";
import WeatherForm, { IWeatherFormProps } from "./WeatherForm";

import ParticipantForm from "./ParticipantForm";
import { useAppSelector } from "../redux/hook";
import ImagePlotting from "./ImagePlotting";
import DuckTeamsModel, { IDuckTeamsModel } from "../model/DuckTeamsModel";
import {
  IParticipantModel,
  ParticipantFormModel,
} from "../model/ParticipantFormModel";
import HuntingSessionService from "../service/huntingSessionService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { IHuntingSessionModel } from "../model/HuntingSession";

const AddindHuntingSession = ({ SetHunting }: any) => {
  const user = useAppSelector((state) => state.users);
  const navigation = useNavigation();
  const huntingSessionService = new HuntingSessionService();
  const { height, width } = useWindowDimensions();
  const [weather, setWeather] = useState<WeatherFormModel>(
    new WeatherFormModel()
  );
  const [participants, setParticipants] = useState<ParticipantFormModel>(
    new ParticipantFormModel()
  );

  const [markers, setMarkers] = useState<IDuckTeamsModel[]>([]);

  const animationStyle: any = React.useCallback((value: number) => {
    "worklet";

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const rotateZ = `${interpolate(value, [-1, 0, 1], [-45, 0, 45])}deg`;
    const translateX = interpolate(
      value,
      [-1, 0, 1],
      [-width * 2, 0, width * 2]
    );

    return {
      transform: [{ rotateZ }, { translateX }],
      zIndex,
    };
  }, []);

  const carouselData = [
    {
      component: <WeatherForm form={weather} setForm={setWeather} />,
    },
    {
      component: (
        <ParticipantForm form={participants} setForm={setParticipants} />
      ),
    },
    {
      component: <ImagePlotting form={markers} setForm={setMarkers} />,
    },
  ];
  let carouselRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const validInput = () => {
    let rs;
    switch (activeIndex) {
      case 0:
        rs = WeatherFormModel.isValidForm(weather);

        setWeather(rs);
        return rs.isFormValid;
      default:
        return true;
    }
  };

  const goToNextSlide = async () => {
    let nextIndex = activeIndex + 1;
    if (!validInput()) {
      return;
    }
    if (nextIndex >= carouselData.length) {
      try {
        const huntsession = await huntingSessionService.saveHuntingSession(
          user.UIID,
          weather,
          markers,
          participants
        );

        SetHunting(huntsession);
      } catch (e: any) {
        console.log(e);
      }

      //navigation.goBack();
      return;
    }
    setActiveIndex(nextIndex);
    carouselRef.current?.next();
  };

  const goToPrevSlide = () => {
    let prevIndex = activeIndex - 1;

    if (prevIndex < 0) {
      return;
    }
    setActiveIndex(prevIndex);
    carouselRef.current?.prev();
  };

  useEffect(() => {}, [activeIndex, participants, user, weather]);

  useEffect(() => {
    if (user) {
      const participant: IParticipantModel = {
        displayName: user.displayName,
        ID: user.UIID,
      };
      const rs = ParticipantFormModel.addParticipants(
        participant,
        participants
      );

      setParticipants(rs);
    }
  }, [user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#556b2f", "#8b4513"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
        }}
      >
        <LottieView
          source={animationData}
          autoPlay={true}
          loop={true}
          resizeMode="cover"
          style={{ paddingBottom: 50, height: 450 }}
        />
      </LinearGradient>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 40,
          left: 10,
          backgroundColor: "white",
          borderRadius: 15,
          borderWidth: 2,
          borderColor: "white",
          paddingVertical: 2,
          paddingHorizontal: 20,
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} color="black" size={30} />
      </TouchableOpacity>
      <ScrollView>
        <View
          style={{
            marginTop: height * 0.4,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderTopLeftRadius: width * 0.07,
              borderTopRightRadius: width * 0.07,
              paddingTop: "2%",
              paddingBottom: "3%",
              width: "100%",
            }}
          >
            <Carousel
              loop={false}
              ref={carouselRef}
              width={width}
              height={height * 0.5}
              autoPlay={false}
              enabled={false}
              data={carouselData}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => {
                const Component = item.component;
                return (
                  <View
                    style={{
                      borderTopLeftRadius: width * 0.1,
                      borderTopRightRadius: width * 0.1,
                    }}
                  >
                    {Component}
                  </View>
                );
              }}
              customAnimation={animationStyle}
            />
            <PaginationIndicator
              totalCount={carouselData.length}
              activeIndex={activeIndex}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              {activeIndex != 0 ? (
                <TouchableOpacity
                  onPress={goToPrevSlide}
                  style={{
                    borderWidth: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    width: 120,
                    height: 40,
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "800" }}>
                    Précédent
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text></Text>
              )}

              <TouchableOpacity
                onPress={goToNextSlide}
                style={{
                  borderWidth: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  width: 120,
                  height: 40,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "800" }}>
                  {activeIndex == carouselData.length - 1
                    ? "Valider"
                    : "Suivant"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    backgroundColor: "gray",
  },
  activeDot: {
    width: 35,
    height: 16,
    borderRadius: 8,
    backgroundColor: "gray",
  },
});
const PaginationIndicator = ({ totalCount, activeIndex }: any) => {
  // Création d'un tableau pour stocker les valeurs animées de chaque dot
  const widthValues = Array.from({ length: totalCount }).map(() =>
    useSharedValue(styles.paginationDot.width)
  );

  // Mise à jour de la largeur du dot actif lorsque l'index change
  useEffect(() => {
    widthValues.forEach((widthValue, index) => {
      widthValue.value = withTiming(
        index === activeIndex
          ? styles.activeDot.width
          : styles.paginationDot.width,
        { duration: 300 }
      );
    });
  }, [activeIndex, widthValues]);

  return (
    <View style={styles.paginationContainer}>
      {widthValues.map((widthValue, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            width: widthValue.value,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.activeDot : null,
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

export default AddindHuntingSession;
