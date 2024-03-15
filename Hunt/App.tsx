import store from "./redux/store";
import { Provider } from "react-redux";
import RootNavigation from "./routes/RootNavigation";
import { registerRootComponent } from "expo";
import Home from "./view/home/HomeScreen";

import AddindHuntingSession from "./components/AddingHuntingSession";
import LottieView from "lottie-react-native";
import MapView from "react-native-maps";
import HuntingSessionScreen from "./view/huntingSession/HuntingSessionScreen";

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}

registerRootComponent(App);
