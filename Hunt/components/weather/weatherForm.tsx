import { SafeAreaView, View, TouchableOpacity, Text } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import WeatherFormContent from "./weatherFormContent";
import WeatherFormHeader from "./weatherFormHeader";
import {
  IWeatherFormModel,
  WeatherFormModel,
} from "../../model/form/WeatherFormModel";

export interface IWeatherFormProps {
  form: WeatherFormModel;
  setForm: React.Dispatch<React.SetStateAction<IWeatherFormModel>>;
}

export default function WeatherForm({ form, setForm }: IWeatherFormProps) {
  return (
    <>
      <WeatherFormHeader />
      <View style={{ flex: 1 }}>
        <WeatherFormContent form={form} setForm={setForm} />
      </View>
    </>
  );
}
