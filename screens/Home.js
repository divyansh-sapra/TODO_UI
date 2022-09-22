import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as helpers from "../Helper";
import * as ConstantResponse from "../ConstantResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Item = ({ item, borderColor, onPress }) => {
  return (
    <TouchableOpacity style={[styles.itemStyle, borderColor]} onPress={onPress}>
      <View style={styles.mainItemHeading}>
        <Text style={styles.headingItemText}>{item.mainTasks}</Text>
      </View>
      <View style={styles.taskCount}>
        <Text style={styles.centerHeading}>Total Number Of</Text>
        <View style={styles.taskTypeHeading}>
          <Text style={styles.taskHeading}>High Task(s)</Text>
          <Text style={styles.taskHeading}>Medium Task(s)</Text>
          <Text style={styles.taskHeading}>Low Task(s)</Text>
        </View>
        <View style={styles.taskTypeHeading}>
          <Text style={styles.taskValues}>{item.highTaskNumber}</Text>
          <Text style={styles.taskValues}>{item.normalTaskNumber}</Text>
          <Text style={styles.taskValues}>{item.lowTaskNumber}</Text>
        </View>
      </View>
      <View style={styles.taskDate}>
        <Text style={styles.centerHeading}>Closest Date Of</Text>
        <View style={styles.taskTypeHeading}>
          <Text style={styles.taskHeading}>High Task(s)</Text>
          <Text style={styles.taskHeading}>Medium Task(s)</Text>
          <Text style={styles.taskHeading}>Low Task(s)</Text>
        </View>
        <View style={styles.taskTypeHeading}>
          <Text style={styles.taskValues}>{item.highTaskDate}</Text>
          <Text style={styles.taskValues}>{item.normalTaskDate}</Text>
          <Text style={styles.taskValues}>{item.lowTaskDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const HomeScreen = ({ navigation, route }) => {
  React.useEffect(() => {
    const getToken = async () => {
      let value = await AsyncStorage.getItem("token");
      setToken(value);
    };
    const getData = async () => {
      let data = await helpers.fetchGetData("get-user-task", {}, token);
      setData(data[0]);
    };
    getToken();
    if (DATA == false) {
      getData();
    }
  });

  let [token, setToken] = React.useState(null);
  let [DATA, setData] = React.useState(false);

  const renderItem = ({ item }) => {
    const borderColor = item.borderColor;
    return (
      <Item
        item={item}
        borderColor={{ borderColor }}
        onPress={() => {
          deleteItem("delete-complete-user-task", item.mainTaskId);
        }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {DATA ? (
        <View style={styles.upperMainView}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.mainTaskId}
          />
        </View>
      ) : (
        <Image
          style={styles.noDataFoundImage}
          source={require("../assets/app_assets/nodatafound.jpg")}
        />
      )}
      <View style={styles.lowerButtons}>
        <TouchableOpacity style={styles.clearAllButton} cons>
          <Text style={styles.lowerButtonsText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}
          onPress={()=>{setData(false)}}
        >
          <Text style={styles.lowerButtonsText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  async function deleteItem(endpoint, mainTaskId) {
    let body = {
      task_id: mainTaskId,
    };
    let res = await helpers.fetchData(endpoint, body, token);
    if (res.message.errorMessage != "") {
      alert(res.message.errorMessage);
    } else {
      setData(false);
    }
  }
};

const styles = StyleSheet.create({
  container: {
    height: "90%",
    backgroundColor: "#2b224d",
    marginTop: 26,
  },
  lowerButtons: {
    height: "8%",
    flexDirection: "row",
  },
  clearAllButton: {
    flex: 1,
    backgroundColor: "#4AAFD5",
    borderRightColor: "black",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#E7A339",
    borderLeftColor: "black",
    borderLefttWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lowerButtonsText: {
    fontWeight: "300",
  },
  itemStyle: {
    height: 250,
    borderWidth: 4,
    margin: 10,
    elevation: 8,
    backgroundColor: "#ffffff",
    justifyContent: "space-evenly",
  },
  mainItemHeading: {
    padding: 5,
    flex: 1.5,
  },
  headingItemText: {
    color: "#401740",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  taskCount: {
    flex: 3,
  },
  taskDate: {
    flex: 3,
  },
  taskTypeHeading: {
    flexDirection: "row",
  },
  taskHeading: {
    fontWeight: "300",
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    padding: 5,
  },
  taskValues: {
    fontWeight: "200",
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    padding: 5,
  },
  centerHeading: {
    paddingLeft: 5,
  },
  upperMainView: {
    height: "100%",
  },
  noDataFoundImage: {
    height: "100%",
    width: "100%",
  },
});
