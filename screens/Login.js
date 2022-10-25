import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as helpers from "../Helper";
import * as ConstantResponse from "../ConstantResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Login = ({ navigation, route }) => {
  let textInputUserName = "Enter Username";
  let textInputEmail = "Enter Email";
  let textInputPassword = "Enter Password";
  let [email, setEmail] = React.useState("poonamsapra73@gmail.com");
  let [username, setUsername] = React.useState("poonam.admin");
  let [passwordUsername, setPasswordUsername] = React.useState("");
  let [password, setPassword] = React.useState("Poonam@73");
  let [secure, setSecure] = React.useState(true);
  let [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    navigation.addListener("blur", () => {
      // setEmail("");
      // setUsername("");
      // setPassword("");
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      {modalVisible ? <ForgotPassModal /> : null}
      <StatusBar style="inverted" />
      <View style={styles.upperLogo}>
        <Text style={styles.text}>Complete Today Succeed Tomorrow</Text>
      </View>
      <View style={styles.lowerLogo}>
        <View style={styles.innerLogin}>
          <View style={styles.textInputView}>
            <TextInput
              value={email}
              style={styles.textInput}
              placeholder={textInputEmail}
              onChangeText={(values) => setEmail(values)}
              autoCapitalize="none"
            />
            <TextInput
              value={username}
              style={styles.textInput}
              placeholder={textInputUserName}
              onChangeText={(values) => setUsername(values)}
              autoCapitalize="none"
            />
            <View>
              <TextInput
                value={password}
                style={styles.textInput}
                placeholder={textInputPassword}
                secureTextEntry={secure}
                onChangeText={(values) => setPassword(values)}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => {
                  setSecure(!secure);
                }}
                underlayColor="none"
                style={styles.passwordButton}
              >
                {secure ? (
                  <Image
                    style={styles.passwordImage}
                    source={require("../assets/app_assets/showPassword.png")}
                  />
                ) : (
                  <Image
                    style={styles.passwordImage}
                    source={require("../assets/app_assets/hidePassword.png")}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.lowerLogin}>
            <TouchableOpacity
              style={styles.loginButton}
              underlayColor="none"
              onPress={() => {
                login("login-user");
              }}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.loginText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => helpers.navigateTo(navigation, "SignUp")}
            >
              <Text style={styles.loginText}>Sign Up?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* {activityIndication?<View style={styles.loading}><ActivityIndicator size="large" color="green" /></View>:null} */}
    </View>
  );

  function sendPassword() {
    console.log("sent");
  }

  async function login(endpoint) {
    let data = null;
    let body = {
      username: username,
      password: password,
      email: email,
    };
    if (email == "" || username == "" || password == "") {
      alert(ConstantResponse.REQUIRED_FIELDS_EMPTY);
    } else {
      data = await helpers.fetchData(endpoint, body);
      if (data.message.errorMessage != "") {
        alert(data.message.errorMessage);
      } else {
        await saveData("token", data.token);
        helpers.navigateTo(navigation, "HomeScreen");
      }
    }
  }

  async function getData(key) {
    try {
      let value = await AsyncStorage.getItem(key);
      return value;
    } catch (e) {
      console.log(e);
    }
  }
  async function saveData(key, data) {
    await AsyncStorage.setItem(key, data);
  }

  function ForgotPassModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.upperModal}>
          <TouchableOpacity
            style={styles.upperModalTouch}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          ></TouchableOpacity>
        </View>
        <View style={styles.lowerModal}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          <TextInput
            value={passwordUsername}
            style={styles.textInput}
            placeholder={textInputUserName}
            onChange={(values) => setPasswordUsername(values)}
          />
          <TouchableOpacity
            style={styles.sendPasswordButton}
            onPress={() => sendPassword()}
          >
            <Text style={styles.sendPasswordText}>Send Password</Text>
          </TouchableOpacity>
          <Text style={styles.infoPasswordText}>
            *Your Password will be sent on registered email*
          </Text>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2d2d",
  },
  text: {
    textAlign: "center",
    color: "yellow",
    fontSize: 25,
    fontWeight: "600",
  },
  upperLogo: {
    flex: 0.3,
    justifyContent: "center",
  },
  lowerLogo: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  innerLogin: {
    justifyContent: "space-between",
    padding: 10,
    borderColor: "yellow",
    borderWidth: 3,
    height: "100%",
    borderRadius: 16,
    width: "75%",
  },
  textInputView: {
    flex: 0.6,
    justifyContent: "space-evenly",
  },
  lowerLogin: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 4,
    color: "black",
    borderColor: "red",
    padding: 10,
    fontFamily: "normal",
  },
  loginButton: {
    backgroundColor: "green",
    justifyContent: "center",
    width: "100%",
    height: "30%",
    alignSelf: "center",
    borderRadius: 5,
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  passwordImage: {
    width: 20,
    height: 20,
  },
  passwordButton: {
    flex: 1,
    width: 25,
    paddingTop: "50%",
    position: "absolute",
    right: "5%",
  },
  passwordView: {
    justifyContent: "center",
    flexDirection: "row",
  },
  lowerLogin: {
    flex: 0.4,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  loginText: {
    color: "white",
  },
  upperModal: {
    flex: 1,
    backgroundColor: "green",
  },
  upperModal: {
    flex: 1,
  },
  upperModalTouch: {
    flex: 1,
    opacity: 0,
  },
  lowerModal: {
    flex: 1,
    backgroundColor: "black",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 2,
    width: "100%",
    borderColor: "blue",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
  },
  infoPasswordText: {
    color: "white",
    fontSize: 8,
    fontStyle: "italic",
  },
  sendPasswordText: {
    color: "white",
  },
  sendPasswordButton: {
    backgroundColor: "grey",
    padding: 5,
    borderRadius: 10,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "6%",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
