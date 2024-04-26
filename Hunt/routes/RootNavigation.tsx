import SignInScreen from "../view/sign/signIn/SignInScreen";
import SignUpScreen from "../view/sign/signUp/SignUpScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAppSelector } from "../redux/hook";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ObservationScreen from "../view/huntingSession/ObservationScreen";
import { useMigTracking } from "../redux/middleware/migTrackingMiddleware";
import DrawerNavigation from "../components/navigation/drawer/DrawerNavigation";
import HuntingForm from "../components/hunting/HuntingForm";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function RootNavigation() {
  const user = useAppSelector((state) => state.users);

  useMigTracking(user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{ headerShown: false }}
      >
        {user.isNew ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DrawerNavigation} />

            <Stack.Screen name="Observation" component={ObservationScreen} />

            <Stack.Screen name="newHunting" component={HuntingForm} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
