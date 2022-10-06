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

const Item = ({ item }) => {
  let cutText = item.task.substring(0, 28);
  let stringCount = cutText.length;
  if (stringCount >= 25) {
    cutText = cutText.concat("...");
  }
  return (
    <View style={styles.itemStyle}>
      <TouchableOpacity style={styles.textTouchable}>
        <TextInput
          value={cutText}
          editable={false}
          style={styles.textInputColor}
        />
        <View style={{ flexDirection: "row" }}>
          <TextInput
            value={item.progress}
            editable={false}
            style={[styles.textInputColor, { paddingRight: 15 }]}
          />
          <TextInput
            value={item.complete_date}
            editable={false}
            style={[styles.textInputColor, { paddingRight: 15 }]}
          />
          <TextInput
            value={item.priority}
            editable={false}
            style={[styles.textInputColor, { paddingRight: 15 }]}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.editButtonView}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => console.log(item.subTaskId)}
        >
          <Text>button</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const SubTaskMain = ({ route, navigation }) => {
  let [token, setToken] = React.useState(null);
  let [DATA, setData] = React.useState(false);
  const params = route.params;
  const mainTaskId = params.navigateMainTaskId;
  const mainTaskName = params.navigateMainTaskName;
  React.useEffect(() => {
    const getToken = async () => {
      let value = await AsyncStorage.getItem("token");
      setToken(value);
    };
    getToken();
    const getData = async () => {
      let body = {
        main_task_id: mainTaskId,
      };
      let data = await helpers.fetchData(
        "get-user-sub-task-by-id",
        body,
        token
      );
      setData(data[0]);
      console.log(data);
    };
    getToken();
    if (DATA == false) {
      getData();
    }
    navigation.addListener("focus", () => {
      getData();
    });
  });

  const renderItem = ({ item }) => {
    return <Item item={item} />;
  };
  return (
    <View style={styles.container}>
      <View style={styles.mainItemHeading}>
        <Text style={styles.headingItemText}>{mainTaskName}</Text>
      </View>
      {DATA ? (
        <View style={styles.upperMainView}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.subTaskId}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </View>
      ) : (
        <Image
          style={styles.noDataFoundImage}
          source={require("../assets/app_assets/nodatafound.jpg")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A2E74",
    marginTop: 26,
  },
  itemStyle: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    height: 100,
    flexDirection: "row",
  },
  mainItemHeading: {
    paddingTop: 10,
  },
  headingItemText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 20,
    textAlign: "center",
  },
  textTouchable: {
    flex: 2.7,
    paddingLeft: 10,
    borderRightWidth: 1,
    justifyContent: "space-evenly",
  },
  editButtonView: {
    flex: 1,
    backgroundColor: "red",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  editButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputColor: { 
    color: "black" 
  },
});
