import { SafeAreaView } from "react-native-safe-area-context";
import ObservationFormContent from "../../components/observation/ObservationFormContent";
import ObservationFormHeader from "../../components/observation/ObservationFormHeader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";

export default function ObservationScreen({}) {
  const route = useRoute<RouteProp<{ params: any }, "params">>();
  const { huntSession } = route.params!;
  const [session, setSession] = useState<any>();
  const currentHuntSession: any = useAppSelector((state) => state.huntSession);
  useEffect(() => {
    setSession(huntSession);
  }, []);

  useEffect(() => {
    if (huntSession && currentHuntSession)
      if (huntSession.id === currentHuntSession.id) {
        setSession(currentHuntSession);
      }
  }, [currentHuntSession]);

  return (
    <SafeAreaView
      style={{ backgroundColor: "#EEEEEE", height: "100%", flex: 1 }}
    >
      <ObservationFormHeader />
      <GestureHandlerRootView style={{ flex: 1 }}>
        {huntSession != null && (
          <ObservationFormContent
            huntingID={huntSession.id}
            observations={session ? session.observations : []}
          />
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
