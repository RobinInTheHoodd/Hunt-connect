import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import HuntingSessionService from "../../service/huntingSessionService";
import HuntingForm from "../../components/hunting/HuntingForm";
import { useCallback, useEffect, useState } from "react";
import { IHuntingSessionModel } from "../../model/HuntingSession";
import { useWindowDimensions } from "react-native";
import { useAppSelector } from "../../redux/hook";
import { useFocusEffect } from "@react-navigation/native";
import { useLoadingVisibility } from "../../utils/LoadingVisibilityContext";
import HuntingSessionInfo from "../../components/HuntingSessionInfo";

export default function HuntingScreen({ navigation }: any) {
  const [huntSession, setHuntSession] = useState<IHuntingSessionModel>();
  //const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector((state) => state.users);
  const huntingSessionService = new HuntingSessionService();

  const { isLoadingVisible, setLoadingVisible } = useLoadingVisibility();

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        const huntSession =
          await huntingSessionService.getCurrentHuntingSession(user.UIID);
        setHuntSession(huntSession);

        setTimeout(() => {
          setLoadingVisible(false);
        }, 2000);
      };

      fetch();
    }, [])
  );

  useEffect(() => {}, [isLoadingVisible, huntSession, user]);

  return (
    <>
      {huntSession ? (
        <>
          <HuntingSessionInfo
            HuntSession={huntSession}
            navigation={navigation}
          />
        </>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: "#EEEEEE" }}
          >
            <HuntingForm
              huntSession={huntSession}
              setHuntSession={setHuntSession}
            />
          </GestureHandlerRootView>
        </SafeAreaView>
      )}
    </>
  );
}
