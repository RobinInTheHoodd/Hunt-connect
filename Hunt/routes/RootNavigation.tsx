import SignInScreen from "../view/sign/signIn/SignInScreen";
import SignUpScreen from "../view/sign/signUp/SignUpScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { useAppSelector } from "../redux/hook";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../view/home/HomeScreen";
import WeatherScreen from "../view/home/WeatherCard";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDove, faLocation } from "@fortawesome/free-solid-svg-icons";

import { SafeAreaProvider } from "react-native-safe-area-context";
import HuntingSessionScreen from "../view/huntingSession/HuntingSessionScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function RootNavigation() {
  const user = useAppSelector((state) => state.users);
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <SafeAreaProvider>
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
            <Stack.Screen name="Dashboard">
              {() => (
                <Tab.Navigator
                  initialRouteName="Home"
                  screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;
                      // You can return any component that you like here!
                      return (
                        <FontAwesomeIcon
                          icon={faDove}
                          size={size}
                          color={color}
                        />
                      );
                    },
                    tabBarActiveTintColor: "tomato",
                    tabBarInactiveTintColor: "gray",
                  })}
                >
                  <Tab.Screen name="Home" component={HomeScreen} />
                  <Tab.Screen
                    name="Session de chasse"
                    component={HuntingSessionScreen}
                    options={{ tabBarStyle: { display: "none" } }}
                  />
                  <Tab.Screen name="Settings" component={HomeScreen} />
                </Tab.Navigator>
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

/*
{user.isNew ? (
        <Stack.Navigator
          initialRouteName="SignIn"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={HomeScreen} />
        </Tab.Navigator>
      )}
      ;
*/
