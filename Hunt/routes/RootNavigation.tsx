import SignInScreen from "../view/sign/signIn/SignInScreen";
import SignUpScreen from "../view/sign/signUp/SignUpScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import HomeScreen from "../view/home/HomeScreen";
import { useAppSelector } from "../redux/hook";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const user = useAppSelector((state) => state.users);
  useEffect(() => {}, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user.isNew ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
