import { useState, useRef, useEffect } from "react";
import { IDuckTeamsModel } from "../../model/DuckTeamsModel";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import HutHunterModel, { IHutHunterModel } from "../../model/HutHunterModel";
import { UserContext } from "../../model/UserContext";
import HutModel from "../../model/HutModel";
import { setLoadingTrue } from "../../redux/reducers/loadingSlice";

interface IHuntingFormProps {
  huntSession: IHuntingSessionModel | undefined;
  setHuntSession: React.Dispatch<
    React.SetStateAction<IHuntingSessionModel | undefined>
  >;
  setCancelForm: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HuntingForm({ navigation }: any) {
  const [huntSession, setHuntSession] = useState<any>();
  const route = useRoute<RouteProp<{ params: any }, "params">>();
  console.log("ROUTE" + JSON.stringify(route.params));
  const user: UserContext = useAppSelector((state) => state.users);
  const hut: HutModel = useAppSelector((state) => state.hut!);
  const hutService = new HuntingSessionService();
  const { height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState(new WeatherFormModel());
  const [participants, setParticipants] = useState<IHutHunterModel[]>([]);
  const dispatch = useAppDispatch();
  const [duckTeam, setDuckTeam] = useState<IDuckTeamsModel[]>([]);

  const footerPosition = useRef(new Animated.Value(0)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const huntingSessionService = new HuntingSessionService();
  const carouselData = [0, 1, 2];
  let carouselRef = useRef(null);

  useEffect(() => {
    console.log("FETCHHHHHHHHH", hut);
    if (hut == undefined || hut.hunter == undefined || hut.hunter.length == 0)
      return;

    let authorizeDay = hut.hunter.find(
      (value) => (value.hunterID = user.UIID)
    )?.authorizeDay;

    setParticipants([
      new HutHunterModel(user.UIID, authorizeDay, user.displayName, user.email),
    ]);
  }, []);

  const goToNextSlide = async () => {
    let nextIndex = activeIndex + 1;
    if (!validInput()) {
      return;
    }
    if (nextIndex >= carouselData.length) {
      try {
        setIsLoading(true);

        const huntsession = await huntingSessionService.saveHuntingSession(
          user.UIID,
          hut.id!,
          weather,
          duckTeam,
          participants
        );
        dispatch(setLoadingTrue());
        navigation.goBack();
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
      navigation.goBack();
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
        return rs.isFormValid;

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
