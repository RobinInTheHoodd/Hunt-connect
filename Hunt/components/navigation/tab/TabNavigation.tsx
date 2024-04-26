import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../../view/home/HomeScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";
import AcceuilScreen from "../../../view/home/AcceuilScreen";
import HuntingScreen from "../../../view/huntingSession/HuntingScreen";
import MigTrackingScreen from "../../../view/liveTracking/MigTracking";
import { defaultLightColors } from "moti/build/skeleton/shared";

const Tab = createBottomTabNavigator();

const TabNavigation = ({ navigation }: any) => {
  return (
    <Tab.Navigator
      initialRouteName="Tab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          return <FontAwesomeIcon icon={faDove} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Acceuil"
        options={({ navigation }) => ({ headerShown: false })}
      >
        {(props) => <AcceuilScreen {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name="Session de chasse"
        options={({ navigation }) => ({ headerShown: false })}
      >
        {(props) => <HuntingScreen {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name="Live Tracking"
        options={({ navigation }) => ({ headerShown: false })}
      >
        {(props) => (
          <MigTrackingScreen {...props} drawerNavigation={navigation} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
export default TabNavigation;
