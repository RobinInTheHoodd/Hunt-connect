import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import HuntingSessionService from "../../service/huntingSessionService";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import HuntingSessionInfo from "../../components/HuntingSessionInfo";
import HuntingHeader from "../../components/hunting/screen/HuntingHeader";
import HuntingCalendar from "../../components/hunting/HuntingCalendar";
import ObservationService from "../../service/observationService";
import { useAppSelector } from "../../redux/hook";
import HuntingSessionModel from "../../model/HuntingSession";

import { useDispatch } from "react-redux";
import {
  setLoadingFalse,
  setLoadingTrue,
} from "../../redux/reducers/loadingSlice";
import HutModel from "../../model/HutModel";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function HuntingScreen({ navigation }: any) {
  const observationService = new ObservationService();
  const huntingSessionService = new HuntingSessionService();
  const dispatch = useDispatch();
  const [huntSession, setHuntSession] = useState<any>(undefined);
  const [huntHistory, setHuntHistory] = useState<any>();
  const [firstDate, setFirstDate] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [canCreate, setCanCreate] = useState(false);

  const isLoading = useAppSelector((state) => state.isLoading);

  const user = useAppSelector((state) => state.users);
  const FetchhuntSession: HuntingSessionModel = useAppSelector(
    (state) => state.huntSession
  )!;
  const hut: HutModel = useAppSelector((state) => state.hut)!;

  const previousSessionRef: any = useRef();
  const previousHutRef: any = useRef();

  useFocusEffect(
    useCallback(() => {
      async function fetch() {
        if (!FetchhuntSession) {
          setHuntSession(undefined);
          return;
        }

        setHuntSession(FetchhuntSession);
      }

      if (previousSessionRef.current !== FetchhuntSession) {
        fetch();
        previousSessionRef.current = FetchhuntSession;
      }
      setTimeout(() => dispatch(setLoadingFalse()), 1000);
    }, [hut, FetchhuntSession, isLoading])
  );

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    let history = await huntingSessionService.getHistoryHuntingSession(
      user.UIID
    );

    if (FetchhuntSession) {
      history = [
        ...history,
        {
          id: FetchhuntSession.id,
          fromDate: new Date(FetchhuntSession.fromDate),
        },
      ];
    }

    setHuntHistory(history);
  }

  useEffect(() => {
    if (huntSession && FetchhuntSession)
      if (huntSession.id === FetchhuntSession!.id) {
        setHuntSession(FetchhuntSession);
        setTimeout(() => dispatch(setLoadingFalse()), 1500);
      }
  }, [FetchhuntSession]);

  const fetchHistoryHunting = useCallback(
    async (huntingID: number) => {
      try {
        if (huntSession !== undefined && huntingID === huntSession!.id) {
        } else {
          dispatch(setLoadingTrue());

          await huntingSessionService.fetHuntSession(
            huntingID.toString(),
            dispatch
          );

          setTimeout(() => {
            dispatch(setLoadingFalse());
          });
        }
      } catch (e: any) {
        dispatch(setLoadingFalse());
        throw e;
      }
    },
    [huntSession]
  );

  const newHunter = () => {
    if (canCreate) navigation.navigate("newHunting");
  };

  const header = useMemo(() => {
    let iconLeft;
    let toucheLeft;

    if (huntSession && huntSession.isFinish) {
      iconLeft = faArrowLeft;
      toucheLeft = async () => {
        setFirstDate("");
        setHuntSession(undefined);
      };
    }
    return (
      <HuntingHeader
        navigation={navigation}
        openModal={() => setIsCalendarOpen(true)}
        title={"Session de chasse"}
        IconLeft={iconLeft}
        TouchIcon={toucheLeft}
      />
    );
  }, [huntSession]);

  useEffect(() => {
    // Vérifie si l'utilisateur peut créer une session aujourd'hui
    const checkPermissions = async () => {
      const allowed = await canCreateSession(hut, user.UIID);
      setCanCreate(allowed);
    };
    checkPermissions();
  }, [user, hut]);

  const canCreateSession = (hutData: any, userId: any) => {
    if (hutData == null) return false;
    if (hutData.ownerId == userId) return true;

    const now = new Date();

    const startDate = new Date(hutData.day.start);
    const endDate = new Date(hutData.day.end);

    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate.setMinutes(0);
    endDate.setSeconds(0);

    const startTime = startDate.getHours();
    const endTime = endDate.getHours();

    let startDay;

    if (now.getHours() < endTime) {
      const previousDay = new Date(now.getTime());
      previousDay.setDate(now.getDate() - 1);
      startDay = previousDay
        .toLocaleString("en-us", { weekday: "long" })
        .toLowerCase();
    } else {
      startDay = now.toLocaleString("en-us", { weekday: "long" }).toLowerCase();
    }

    const hunter = hutData.hunter.find((h: any) => h.hunterID === userId);

    if (!hunter) {
      console.log("Utilisateur non trouvé parmi les chasseurs autorisés.");
      return false;
    }

    const isAuthorizedToday = hunter.authorizeDay[startDay];

    if (isAuthorizedToday) {
      console.log(
        "L'utilisateur est autorisé à créer une session aujourd'hui."
      );
    } else {
      console.log("L'utilisateur n'est pas autorisé à chasser aujourd'hui.");
    }

    return isAuthorizedToday;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#EEEEEE" }}>
        {!isLoading && huntSession === undefined ? (
          <View
            style={{
              padding: 15,
              flexGrow: 1,
              alignItems: "center",
              backgroundColor: "#EEEEEE",
            }}
          >
            {header}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>
                Aucune session de chasse actuelle
              </Text>
              <TouchableOpacity
                onPress={() => newHunter()}
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderBottomWidth: 4,
                  borderRightWidth: 4,
                  alignItems: "center",
                  justifyContent: "center",
                  width: 300,
                  height: 40,
                  marginTop: 50,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  Ouvrire une nouvelle session ?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <HuntingSessionInfo
            HuntSession={huntSession}
            observ={huntSession !== undefined ? huntSession.observations : []}
            navigation={navigation}
            header={header}
          />
        )}

        {huntHistory && (
          <HuntingCalendar
            closeModal={() => setIsCalendarOpen(false)}
            isModalVisible={isCalendarOpen}
            history={huntHistory}
            fetchHistoryHunting={fetchHistoryHunting}
            firstDate={firstDate}
            setFirstDate={setFirstDate}
          />
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

/*






*/
