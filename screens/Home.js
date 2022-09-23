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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as helpers from "../Helper";
import * as ConstantResponse from "../ConstantResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Item = ({ item, borderColor, onLongPress, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.itemStyle, borderColor]}
      onLongPress={onLongPress}
      onPress={onPress}
    >
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
  let [markDeleteCompleteModal, setMarkDeleteCompleteModal] =
    React.useState(false);
  let [addMainTaskModal, setAddMainTaskModal] = React.useState(false);
  let [addNewMainTaskModel, setAddNewMainTaskModel] = React.useState(false);
  let [selectedTaskName, setSelectedTaskName] = React.useState("");
  let [mainTaskId, setMainTaskId] = React.useState("");
  const textInputMainTaskValue = "Enter main task";

  const renderItem = ({ item }) => {
    const borderColor = item.borderColor;
    return (
      <Item
        item={item}
        borderColor={{ borderColor }}
        onLongPress={() => {
          setSelectedTaskName(item.mainTasks);
          setMainTaskId(item.mainTaskId);
          setMarkDeleteCompleteModal(!markDeleteCompleteModal);
        }}
        onPress={() => {
          console.log("Short Press");
        }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {DATA ? (
        <View style={styles.upperMainView}>
          {markDeleteCompleteModal ? <MarkDeleteCompleteModal /> : null}
          {addMainTaskModal ? <AddNewTaskModal /> : null}
          {addNewMainTaskModel ? <AddMainTask /> : null}
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
        <TouchableOpacity
          style={styles.clearAllButton}
          onPress={() => clearAllItems("clear-all-user-task")}
        >
          <Text style={styles.lowerButtonsText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setAddMainTaskModal(!addMainTaskModal);
          }}
        >
          <Text style={styles.lowerButtonsText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  async function deleteItem(endpoint) {
    let body = {
      task_id: mainTaskId,
    };
    setMarkDeleteCompleteModal(!markDeleteCompleteModal);
    let res = await helpers.fetchData(endpoint, body, token);
    if (res.message.errorMessage != "") {
      alert(res.message.errorMessage);
    } else {
      setData(false);
    }
  }

  async function addItem(endpoint, mainTaskIdValue) {
    let body = {
      main_task: mainTaskIdValue,
    };
    let res = await helpers.fetchData(endpoint, body, token);
    if (res.message.errorMessage != "") {
      alert(res.message.errorMessage);
    } else {
      alert(res.message.successMessage);
    }
  }

  async function completeItem(endpoint) {
    let body = {
      task_id: mainTaskId,
    };
    setMarkDeleteCompleteModal(!markDeleteCompleteModal);
    let res = await helpers.fetchData(endpoint, body, token);
    if (res.message.errorMessage != "") {
      alert(res.message.errorMessage);
    } else {
      setData(false);
    }
  }

  async function clearAllItems(endpoint) {
    let res = await helpers.fetchGetData(endpoint, {}, token);
    if (res.message.errorMessage != "") {
      alert(res.message.errorMessage);
    } else {
      setData(false);
    }
  }

  function AddNewTaskModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={addMainTaskModal}
        onRequestClose={() => {
          setAddMainTaskModal(!addMainTaskModal);
        }}
      >
        <View style={styles.upperModal}>
          <TouchableOpacity
            style={styles.upperModalTouch}
            onPress={() => {
              setAddMainTaskModal(!addMainTaskModal);
            }}
          ></TouchableOpacity>
        </View>
        <View style={styles.addTaskLowerModal}>
          <Text style={styles.addTaskunSelectedText}>
            To add main task, Click on{" "}
            <Text style={styles.selectedText}>MAIN TASK </Text>
          </Text>
          <Text style={styles.addTaskunSelectedText}>
            To add sub task, Click on{" "}
            <Text style={styles.selectedText}>SUB TASK </Text>
          </Text>
          <View style={styles.addTaskLowerModelButtons}>
            <TouchableOpacity
              style={styles.addTaskMainTask}
              onPress={() => {
                setAddMainTaskModal(!addMainTaskModal);
                setAddNewMainTaskModel(!addNewMainTaskModel);
              }}
            >
              <Text style={styles.addTaskInnerButtonText}>MAIN TASK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addTaskSubTask} onPress={() => {}}>
              <Text style={styles.addTaskInnerButtonText}>SUB TASK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function AddMainTask() {
    let [mainTaskIdValue, setMainTaskIdValue] = React.useState("");
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={addNewMainTaskModel}
        onRequestClose={() => {
          setAddNewMainTaskModel(!addNewMainTaskModel);
        }}
      >
        <View style={styles.addMainTaskUpperModal}>
          <TouchableOpacity
            style={styles.addMainTaskUpperModalTouch}
            onPress={() => {
              setAddMainTaskModal(!addMainTaskModal);
              setAddNewMainTaskModel(!addNewMainTaskModel);
            }}
          ></TouchableOpacity>
        </View>
        <View style={styles.addNewTaskLowerModal}>
          <Text style={styles.addNewTaskUnSelectedText}>
            <Text style={styles.selectedText}>Enter Main Task </Text>
          </Text>
          <TextInput
            value={mainTaskIdValue}
            style={styles.textInput}
            placeholder={textInputMainTaskValue}
            onChangeText={(text) => setMainTaskIdValue(text)}
            autoCapitalize="sentences"
          />
          <TouchableOpacity
            style={styles.addMainTask}
            onPress={() => {
              Keyboard.dismiss();
              addItem("add-main-task", mainTaskIdValue);
              setMainTaskIdValue("");
            }}
          >
            <Text style={styles.innerButtonText}>ADD TASK</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addMainTaskUpperModal}>
          <TouchableOpacity
            style={styles.addMainTaskUpperModalTouch}
            onPress={() => {
              setAddMainTaskModal(!addMainTaskModal);
              setAddNewMainTaskModel(!addNewMainTaskModel);
            }}
          ></TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function MarkDeleteCompleteModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={markDeleteCompleteModal}
        onRequestClose={() => {
          setMarkDeleteCompleteModal(!markDeleteCompleteModal);
        }}
      >
        <View style={styles.upperModal}>
          <TouchableOpacity
            style={styles.upperModalTouch}
            onPress={() => {
              setMarkDeleteCompleteModal(!markDeleteCompleteModal);
            }}
          ></TouchableOpacity>
        </View>
        <View style={styles.lowerModal}>
          <Text style={styles.unSelectedText}>
            Mark all substask(s) under{" "}
            <Text style={styles.selectedText}>{selectedTaskName}</Text> as:
          </Text>
          <View style={styles.lowerModelButtons}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                deleteItem("delete-complete-user-task");
              }}
            >
              <Text style={styles.innerButtonText}>REMOVE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => {
                completeItem("complete-all-user-task");
              }}
            >
              <Text style={styles.innerButtonText}>COMPLETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
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
  upperModal: {
    height: "80%",
  },
  upperModalTouch: {
    flex: 1,
    opacity: 0,
  },
  lowerModal: {
    height: "20%",
    backgroundColor: "#f5dfe5",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 3,
    width: "100%",
    borderColor: "#f55d90",
    alignItems: "center",
  },
  unSelectedText: {
    fontWeight: "200",
    padding: 10,
    height: "45%",
    fontSize: 13,
  },
  selectedText: {
    fontWeight: "500",
  },
  lowerModelButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  addTaskLowerModelButtons: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  addTaskunSelectedText: {
    fontWeight: "200",
    paddingTop: 10,
    height: "25%",
    fontSize: 13,
  },
  completeButton: {
    backgroundColor: "#BBCB50",
    borderRadius: 5,
    justifyContent: "center",
    width: "35%",
  },
  removeButton: {
    backgroundColor: "#678CEC",
    justifyContent: "center",
    borderRadius: 5,
    width: "35%",
  },
  innerButtonText: {
    textAlign: "center",
    paddingTop: 8,
    paddingBottom: 8,
    color: "#f5dfe5",
  },
  addTaskLowerModal: {
    height: "20%",
    backgroundColor: "#7aa7f5",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 3,
    width: "100%",
    borderColor: "#f55d90",
    alignItems: "center",
  },
  addTaskSubTask: {
    backgroundColor: "#78FFC4",
    borderRadius: 5,
    justifyContent: "center",
    width: "35%",
  },
  addTaskMainTask: {
    backgroundColor: "#FDC2E4",
    justifyContent: "center",
    borderRadius: 5,
    width: "35%",
  },
  addTaskInnerButtonText: {
    textAlign: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  addMainTaskUpperModal: {
    flex: 1.5,
  },
  addMainTaskUpperModalTouch: {
    height: "100%",
    opacity: 0,
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 4,
    color: "black",
    borderColor: "red",
    padding: 10,
    fontFamily: "normal",
    height: "50%",
  },
  addNewTaskLowerModal: {
    flex: 2,
    backgroundColor: "#f5dfe5",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 3,
    width: "100%",
    justifyContent: "space-between",
    borderColor: "#f55d90",
  },
  addNewTaskUnSelectedText: {
    fontWeight: "200",
    padding: 10,
    // height: "10%",
    fontSize: 13,
  },
  addMainTask: {
    backgroundColor: "#BBCB50",
    borderRadius: 5,
    justifyContent: "center",
    width: "35%",
    alignSelf: "center",
    marginBottom: 10,
  },
});
