import store from "./redux/store";
import { Provider } from "react-redux";
import RootNavigation from "./routes/RootNavigation";
import { registerRootComponent } from "expo";
import { LoadingVisibilityProvider } from "./utils/LoadingVisibilityContext";

export default function App() {
  return (
    <Provider store={store}>
      <LoadingVisibilityProvider>
        <RootNavigation />
      </LoadingVisibilityProvider>
    </Provider>
  );
}

registerRootComponent(App);
