import { useState, useRef, useEffect } from "react";
import { IDuckTeamsModel } from "../../model/DuckTeamsModel";
import { useAppSelector } from "../../redux/hook";
import HuntingSessionService from "../../service/huntingSessionService";
import { WeatherFormModel } from "../../model/form/WeatherFormModel";
import { ParticipantFormModel } from "../../model/ParticipantFormModel";
import HuntingFormCaroussel from "./HuntingFormCaroussel";
import DuckTeamForm from "../duckTeams/DuckTeamForm";
import { IHuntingSessionModel } from "../../model/HuntingSession";
import HuntingFormFooter from "./HuntingFormFooter";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Keyboard,
  useWindowDimensions,
  Animated,
} from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import HuntingFormPagination from "./HuntingFormPagination";
import HuntingParticipantModel, {
  IHuntingParticipanModel,
} from "../../model/HuntingParticipantModel";

interface IHuntingFormProps {
  huntSession: IHuntingSessionModel | undefined;
  setHuntSession: React.Dispatch<
    React.SetStateAction<IHuntingSessionModel | undefined>
  >;
}

export default function HuntingForm({
  huntSession,
  setHuntSession,
}: IHuntingFormProps) {
  const user = useAppSelector((state) => state.users);
  const hutService = new HuntingSessionService();
  const { height } = useWindowDimensions();

  const [weather, setWeather] = useState(new WeatherFormModel());
  const [participants, setParticipants] = useState<IHuntingParticipanModel[]>(
    []
  );
  const [duckTeam, setDuckTeam] = useState<IDuckTeamsModel[]>([]);

  const footerPosition = useRef(new Animated.Value(0)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const huntingSessionService = new HuntingSessionService();
  const carouselData = [0, 1, 2];
  let carouselRef = useRef(null);

  useEffect(() => {}, [huntSession]);

  const goToNextSlide = async () => {
    let nextIndex = activeIndex + 1;
    if (!validInput()) {
      return;
    }
    if (nextIndex >= carouselData.length) {
      try {
        console.log("HUNT------------------------------------------");
        const huntsession = await huntingSessionService.saveHuntingSession(
          user.UIID,
          weather,
          duckTeam,
          participants
        );
        console.log(weather);
        console.log(duckTeam);
        console.log(participants);
        console.log(huntSession);
        console.log("FIN------------------------------------------");
        setHuntSession(huntsession);
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

  const validInput = () => {
    let rs;
    switch (activeIndex) {
      case 0:
        rs = WeatherFormModel.isValidForm(weather);
        setWeather(rs);
        return true;
      default:
        return true;
    }
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        const keyboardHeight = e.endCoordinates.height;
        Animated.timing(footerPosition, {
          toValue: keyboardHeight,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(footerPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [footerPosition]);
  return (
    <>
      <KeyboardAvoidingView
        style={{}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <HuntingFormCaroussel
          duckTeam={duckTeam}
          setDuckTeam={setDuckTeam}
          participants={participants}
          setParticipants={setParticipants}
          weather={weather}
          setWeather={setWeather}
          carouselRef={carouselRef}
          carouselData={carouselData}
        />

        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            zIndex: 10,
            bottom: 0,
            transform: [{ translateY: footerPosition }],
          }}
        >
          <HuntingFormFooter
            goToNextSlide={goToNextSlide}
            goToPrevSlide={goToPrevSlide}
            activeIndex={activeIndex}
            carouselleLength={carouselData.length}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </>
  );
}
