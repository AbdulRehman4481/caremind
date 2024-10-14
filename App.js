import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
import TaskDetail from "./app/TaskDetail/TaskDetail";
import HomeScreen from "./app/HomeScreen/HomeScreen";
import Login from "./app/Login/Login";
import { PaperProvider } from "react-native-paper";

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShadow: false,
            }}
          />
          <Stack.Screen
            name="Details"
            component={TaskDetail}
            options={{
              headerShadow: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShadow: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
