import { SafeAreaView } from "react-native-safe-area-context";
import ObservationFormContent from "../../components/observation/ObservationFormContent";
import ObservationFormHeader from "../../components/observation/ObservationFormHeader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppSelector } from "../../redux/hook";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { selectObservations } from "../../redux/reducers/observationSlice";

export default function ObservationScreen({}) {
  const route = useRoute<RouteProp<{ params: any }, "params">>();
  const { huntingID } = route.params!;
  const { entities } = useAppSelector(selectObservations);

  return (
    <SafeAreaView
      style={{ backgroundColor: "#EEEEEE", height: "100%", flex: 1 }}
    >
      <ObservationFormHeader />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ObservationFormContent huntingID={huntingID} observations={entities} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
