import store from "./redux/store";
import { Provider } from "react-redux";
import RootNavigation from "./routes/RootNavigation";
import { registerRootComponent } from "expo";
import { LoadingVisibilityProvider } from "./utils/LoadingVisibilityContext";
import { useState } from "react";
import { IParticipantModel } from "./model/ParticipantFormModel";

export default function App() {
  const [form, setForm] = useState<IParticipantModel[]>([]);
  return (
    <Provider store={store}>
      <LoadingVisibilityProvider>
        <RootNavigation />
      </LoadingVisibilityProvider>
    </Provider>
  );
}
registerRootComponent(App);
