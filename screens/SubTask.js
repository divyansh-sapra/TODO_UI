import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Keyboard,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as helpers from "../Helper";
import * as ConstantResponse from "../ConstantResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectList from "react-native-dropdown-select-list";
import CalendarPicker from "react-native-calendar-picker";

export const SubTaskMain = ({ route, navigation }) => {
  let [token, setToken] = React.useState(null);
  const params = route.params;
  const mainTaskId = params.navigateMainTaskId;
  React.useEffect(() => {
    const getToken = async () => {
      let value = await AsyncStorage.getItem("token");
      setToken(value);
    };
    getToken();
    // const getData = async () => {
    //   let data = await helpers.fetchGetData("get-user-task", {}, token);
    //   setData(data[0]);
    // };
    // getToken();
    // if (DATA == false) {
    //   getData();
    // }
  });

  return (
    <View>
      <Text>Main task id is {mainTaskId}</Text>
      <Text>Main task id is {token}</Text>
    </View>
  );
};
