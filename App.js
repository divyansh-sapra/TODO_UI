import * as React from "react";
import { ActivityIndicator, StyleSheet, Text, View, Image } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./screens/Login";
import { SignUp } from "./screens/SignUp";
import { HomeScreen } from "./screens/Home";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

function StartPage() {
  return (
    <View style={styles.startPage}>
      <Image
        style={styles.image}
        source={require("../path-to-success/assets/app_assets/todo_logo.png")}
      />
      <Text style={styles.startText}>Complete Today Succeed Tomorrow</Text>
      <ActivityIndicator size="large" color="yellow" />
    </View>
  );
}

const App = () => {
  let [showStart, setShowStart] = React.useState(true);
  const onLoadEffect = () => {
    setTimeout(() => {
      setShowStart(false);
    }, 3000);
  };
  React.useEffect(onLoadEffect, []);
  if (showStart) {
    return <StartPage />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  startPage: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  startText: {
    padding: 20,
    color: "white",
  },
  image: {
    width: 250,
    height: 100,
  },
});

export default App;
