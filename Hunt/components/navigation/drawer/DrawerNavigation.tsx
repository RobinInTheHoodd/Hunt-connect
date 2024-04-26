import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAppSelector } from "../../../redux/hook";
import TabNavigation from "../tab/TabNavigation";
import DrawerContent from "./DrawerContent";
import HutSettingScreen from "../../../view/setting/HutSetting";

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  const user = useAppSelector((state) => state.users);

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Group
        screenOptions={{ drawerStyle: { flex: 1, borderWidth: 2 } }}
      >
        <Drawer.Screen
          name="Home"
          options={({ navigation }) => ({
            drawerStyle: { flex: 1, borderWidth: 1 },
            headerShown: false,
          })}
        >
          {(props) => <TabNavigation {...props} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="Paramètres hut"
          options={({ navigation }) => ({
            drawerStyle: { flex: 1, borderWidth: 1 },
            headerShown: false,
          })}
          component={HutSettingScreen}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
}
