import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import HuntingSessionService from "../../service/huntingSessionService";
import HuntingForm from "../../components/hunting/HuntingForm";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Text, View, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import HuntingSessionInfo from "../../components/HuntingSessionInfo";
import HuntingHeader from "../../components/hunting/screen/HuntingHeader";
import HuntingCalendar from "../../components/hunting/HuntingCalendar";
import ObservationService from "../../service/observationService";
import { useAppSelector } from "../../redux/hook";

export default function HuntingScreen({ navigation }: any) {
  const observationService = new ObservationService();
  const huntingSessionService = new HuntingSessionService();
  const [huntSession, setHuntSession] = useState<any>();
  const [huntHistory, setHuntHistory] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCreateHuntSession, setIsCreateHuntSession] = useState(false);

  const user = useAppSelector((state) => state.users);

  let FetchhuntSession: any = useAppSelector((state) => state.huntSession);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        let history: { id: number; fromDate: Date }[] =
          await huntingSessionService.getHistoryHuntingSession(user.UIID);
        if (FetchhuntSession === null) setHuntSession(undefined);
        else {
          history.push({
            id: FetchhuntSession.id,
            fromDate: new Date(FetchhuntSession.fromDate),
          });
          setHuntSession(FetchhuntSession);
        }

        console.log(JSON.stringify(history, null, 2));

        setHuntHistory(history);
        setIsLoading(false);
        setIsCreateHuntSession(false);
      };
      setIsLoading(true);
      setTimeout(() => {
        fetch();
      }, 500);
    }, [FetchhuntSession, navigation.isFocused()])
  );

  useEffect(() => {
    if (huntSession && FetchhuntSession)
      if (huntSession.id === FetchhuntSession!.id)
        setHuntSession(FetchhuntSession);
  }, [FetchhuntSession]);

  const fetchHistoryHunting = useCallback(
    async (huntingID: number) => {
      setIsLoading(true);
      try {
        if (huntingID === huntSession!.id) {
        } else {
          const huntingHistory = await huntingSessionService.getByID(huntingID);
          const observationsHistory = await observationService.getObservations(
            huntingID
          );

          const timerId = setTimeout(() => {
            setHuntSession({
              ...huntingHistory,
              observations: observationsHistory,
            });
            setIsLoading(false);
          }, 500);
        }
      } catch (e: any) {
        setIsLoading(false);
        throw e;
      }
    },
    [huntSession]
  );

  const header = useMemo(() => {
    return (
      <HuntingHeader
        navigation={navigation}
        openModal={() => setIsCalendarOpen(true)}
        title={"Session de chasse"}
      />
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#EEEEEE" }}>
        {!isLoading && huntSession === undefined ? (
          <>
            {isCreateHuntSession ? (
              <HuntingForm
                huntSession={huntSession}
                setHuntSession={setHuntSession}
                setCancelForm={setIsCreateHuntSession}
              />
            ) : (
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
                    onPress={() => setIsCreateHuntSession(true)}
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
            )}
          </>
        ) : (
          <HuntingSessionInfo
            HuntSession={huntSession}
            observ={huntSession !== undefined ? huntSession.observations : []}
            navigation={navigation}
            header={header}
            isLoading={isLoading}
          />
        )}

        {huntHistory && (
          <HuntingCalendar
            closeModal={() => setIsCalendarOpen(false)}
            isModalVisible={isCalendarOpen}
            history={huntHistory}
            fetchHistoryHunting={fetchHistoryHunting}
          />
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

/*






*/
