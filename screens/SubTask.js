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

const Item = ({ item, onTaskPress, onEditPress }) => {
  let cutText = item.task.substring(0, 28);
  let stringCount = cutText.length;
  if (stringCount >= 25) {
    cutText = cutText.concat("...");
  }
  return (
    <View style={styles.itemStyle}>
      <TouchableOpacity style={styles.textTouchable} onPress={onTaskPress}>
        <TextInput
          value={cutText}
          editable={false}
          style={styles.textInputColor}
        />
        <View>
          <View style={styles.textInputShow}>
            <View style={{ alignItems: "center" }}>
              <Text>Growth</Text>
              <Text style={[styles.textInputColor, styles.addRightPading]}>
                {item.progress}
                {"%"}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>Last Date</Text>
              <Text style={[styles.textInputColor, styles.addRightPading]}>
                {item.complete_date}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>Priority</Text>
              <Text style={[styles.textInputColor, styles.addRightPading]}>
                {item.priority}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.editButtonView}>
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const SubTaskMain = ({ route, navigation }) => {
  let [token, setToken] = React.useState(null);
  let [DATA, setData] = React.useState(false);
  let [fullSubTask, openFullSubTask] = React.useState(false);
  let [editSubTask, editFullSubTask] = React.useState(false);
  let [subTask, setSubTask] = React.useState(null);
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
    return (
      <Item
        item={item}
        onTaskPress={() => {
          setSubTask(item);
          openFullSubTask(!fullSubTask);
        }}
        onEditPress={() => {
          setSubTask(item);
          editFullSubTask(!editSubTask);
        }}
      />
    );
  };
  return (
    <View style={styles.container}>
      {fullSubTask ? <FullSubTask /> : null}
      {editSubTask ? <EditSubTask /> : null}
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

  function FullSubTask() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={fullSubTask}
        onRequestClose={() => {
          openFullSubTask(!fullSubTask);
        }}
      >
        <View style={styles.lowerModal}>
          <View style={styles.upperModal}>
            <View style={styles.scrollText}>
              <ScrollView>
                <Text style={styles.selectedText}>
                  Task:{" "}
                  <Text style={styles.unSelectedText}>{subTask.task}</Text>
                </Text>
              </ScrollView>
            </View>
            <Text style={styles.selectedText}>
              Growth:{" "}
              <Text style={styles.unSelectedText}>{subTask.progress}</Text>
            </Text>
            <Text style={styles.selectedText}>
              Last Date:{" "}
              <Text style={styles.unSelectedText}>{subTask.complete_date}</Text>
            </Text>
            <Text style={styles.selectedText}>
              Priority:{" "}
              <Text style={styles.unSelectedText}>{subTask.priority}</Text>
            </Text>
          </View>
          <View style={styles.lowerModelButtons}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                deleteItem("delete-user-sub-task");
              }}
            >
              <Text style={styles.innerButtonText}>REMOVE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => {
                completeItem("complete-user-sub-task");
              }}
            >
              <Text style={styles.innerButtonText}>COMPLETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function EditSubTask() {
    let [tempTask, updateTempText] = React.useState(subTask.task);
    let [tempcompleteDate, updateTempCompleteDate] = React.useState(
      subTask.complete_date
    );
    let [tempPriority, updateTempPriority] = React.useState(subTask.priority);
    let [tempProgress, updateTempProgress] = React.useState(subTask.progress);
    const data = [
      { key: "HIGH", value: "High" },
      { key: "MEDIUM", value: "Medium" },
      { key: "LOW", value: "Low" },
    ];
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={editSubTask}
        onRequestClose={() => {
          editFullSubTask(!editSubTask);
        }}
      >
        <View style={styles.lowerModal}>
          <View style={styles.upperModal}>
            <View style={styles.textInputScrollText}>
              <ScrollView>
                <Text style={styles.selectedText}>Task:</Text>
                <TextInput
                  value={tempTask}
                  style={styles.updateTexinputunSelectedText}
                  autoCapitalize="sentences"
                  multiline={true}
                  onChangeText={(text) => updateTempText(text)}
                />
              </ScrollView>
            </View>
            <Text style={styles.selectedText}>Growth:</Text>
            <TextInput
              value={tempProgress}
              style={[styles.updateTexinputunSelectedText, styles.height50]}
              autoCapitalize="sentences"
              multiline={true}
              keyboardType="numeric"
              onChangeText={(text) => updateTempProgress(text)}
            />
            <Text style={styles.selectedText}>Last Date:</Text>
            <TextInput
              value={tempcompleteDate}
              style={[styles.updateTexinputunSelectedText, styles.height50]}
              autoCapitalize="sentences"
              multiline={true}
              onChangeText={(text) => updateTempCompleteDate(text)}
            />
            <Text style={styles.selectedText}>Priority: {tempPriority}</Text>
            <SelectList
              boxStyles={styles.dropdownBox}
              setSelected={updateTempPriority}
              data={data}
              maxHeight={145}
              dropdownStyles={styles.dropdownStyles}
              dropdownItemStyles={styles.dropdownItemStyles}
            />
          </View>
          <View style={styles.lowerModelButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                updateTask(
                  "update-user-sub-task",
                  tempTask,
                  tempcompleteDate,
                  tempPriority,
                  tempProgress
                );
              }}
            >
              <Text style={styles.innerButtonText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  async function updateTask(
    endpoint,
    tempTask,
    tempcompleteDate,
    tempPriority,
    tempProgress
  ) {
    let body = {
      sub_task_id: subTask.subTaskId,
      sub_task_priority: tempPriority,
      sub_task_progress: tempProgress,
      sub_task_complete_date: tempcompleteDate,
      sub_task_task: tempTask,
    };
    editFullSubTask(!editSubTask);
    let res = await helpers.fetchData(endpoint, body, token);
    if (res.message.errorMessage != "") {
      alert(res.message.errorMessage);
    } else {
      setData(false);
    }
  }

  async function completeItem(endpoint) {
    let body = {
      sub_task_id: subTask.subTaskId,
    };
    openFullSubTask(!fullSubTask);
    let res = await helpers.fetchData(endpoint, body, token);
    if (res.message.errorMessage != "") {
      alert(res.message.errorMessage);
    } else {
      setData(false);
    }
  }

  async function deleteItem(endpoint) {
    let body = {
      sub_task_id: subTask.subTaskId,
    };
    openFullSubTask(!fullSubTask);
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
    backgroundColor: "#5ECF3E",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  editButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputColor: {
    color: "black",
  },
  addRightPading: {
    opacity: 0.6,
  },
  textInputShow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
  },
  upperModal: {
    height: "90%",
  },
  upperModalTouch: {
    flex: 1,
    opacity: 0,
  },
  lowerModal: {
    height: "100%",
    backgroundColor: "#f5dfe5",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 3,
    width: "100%",
    borderColor: "#f55d90",
  },
  unSelectedText: {
    fontWeight: "200",
    padding: 10,
    height: "45%",
    fontSize: 13,
  },
  selectedText: {
    fontWeight: "500",
    paddingTop: 10,
    paddingLeft: 5,
  },
  lowerModelButtons: {
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: "center",
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
  saveButton: {
    backgroundColor: "#364FFB",
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
  scrollText: {
    maxHeight: "85%",
  },
  updateTexinputunSelectedText: {
    fontWeight: "200",
    padding: 10,
    fontSize: 13,
    paddingTop: 5,
  },
  height50: {
    height: 50,
  },
  textInputScrollText: {
    maxHeight: "63%",
  },
  dropdownBox: {
    backgroundColor: "#ffffff",
    width: "50%",
    marginLeft: 5,
    marginTop: 5,
  },
  dropdownStyles: {
    backgroundColor: "#ffffff",
  },
  dropdownItemStyles: {
    color: "grey",
  },
  dateText: {
    backgroundColor: "#ffffff",
    borderRadius: 4,
    width: "70%",
    paddingLeft: 5,
  },
  calenderButton: {
    flex: 1,
    width: 25,
    paddingTop: "25%",
    position: "absolute",
    right: "30%",
  },
  calenderImage: {
    width: 20,
    height: 20,
  },
  addMainTaskUpperModal: {
    flex: 1,
  },
  addMainTaskUpperModalTouch: {
    height: "100%",
    opacity: 0,
  },
  addSubTaskLowerModal: {
    flex: 1.6,
    backgroundColor: "#f5dfe5",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 3,
    width: "100%",
    justifyContent: "space-between",
    borderColor: "#f55d90",
  },
});
