import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as helpers from "../Helper";
import * as ConstantResponse from "../ConstantResponse";

export const SignUp = ({ navigation, route }) => {
  let textInputUserName = "Enter Username";
  let textInputEmail = "Enter Email";
  let textInputPassword = "Enter Password";
  let textInputRepeatPassword = "Repeat Password";
  let textInputName = "Enter Name";
  let textInputMobile = "Enter Mobile";
  let textInputOtp = "Enter OTP";
  let textInputVerifyEmail = "Enter Email";
  let [email, setEmail] = React.useState("");
  let [username, setUsername] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [repeatPassword, setRepeatPassword] = React.useState("");
  let [name, setName] = React.useState("");
  let [mobile, setMobile] = React.useState("");
  let [otp, setOtp] = React.useState("");
  let [verifyEmail, setVeifyEmail] = React.useState("");
  let [finalEmail, setFinalEmail] = React.useState("");
  let [modalVisible, setModalVisible] = React.useState(false);
  let [isEditable, setIsEditable] = React.useState(true);

  return (
    <View style={styles.container}>
      {modalVisible ? (
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
                setIsEditable(!isEditable);
                setVeifyEmail("");
                setOtp("");
                setModalVisible(!modalVisible);
              }}
            ></TouchableOpacity>
          </View>
          <View style={styles.lowerModal}>
            <Text style={styles.verifyAccountModalText}>Verify Account</Text>
            <View style={styles.emailView}>
              <TextInput
                value={verifyEmail}
                style={styles.textInputModal}
                placeholder={textInputVerifyEmail}
                onChangeText={(text) => setVeifyEmail(text)}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.sendOtpButton}
                onPress={() => sendOtp("send-otp")}
              >
                <Text style={styles.otpText}>Send OTP</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.otpView}>
              <TextInput
                value={otp}
                style={styles.textInputModal}
                placeholder={textInputOtp}
                onChangeText={(values) => setOtp(values)}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.verifyOtpButton}
                onPress={() => verifyOtp("verify-otp")}
              >
                <Text style={styles.otpText}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}
      <StatusBar style="inverted" />
      <View style={styles.view}>
        <View style={styles.topView}>
          <TouchableOpacity
           style={styles.backButton}
           onPress={()=>navigation.goBack()}
          >
            <Image
              style={styles.image}
              source={require("../assets/app_assets/back_icon_colored.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.verifyAccountButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.verifyAccountText}>Verify Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formView}>
          <Text style={styles.registerText}>Register</Text>
          <TextInput
            value={name}
            style={styles.textInput}
            placeholder={textInputName}
            onChangeText={(values) => setName(values)}
          />
          <TextInput
            maxLength={10}
            autoCapitalize="none"
            keyboardType="numeric"
            value={mobile}
            style={styles.textInput}
            placeholder={textInputMobile}
            onChangeText={(values) => setMobile(values)}
          />
          <TextInput
            keyboardType="email-address"
            value={email}
            autoCapitalize="none"
            style={styles.textInput}
            placeholder={textInputEmail}
            onChangeText={(values) => setEmail(values)}
          />
          <TextInput
            value={username}
            autoCapitalize="none"
            style={styles.textInput}
            placeholder={textInputUserName}
            onChangeText={(values) => setUsername(values)}
          />
          <TextInput
            secureTextEntry={true}
            autoCapitalize="none"
            value={password}
            style={styles.textInput}
            placeholder={textInputPassword}
            onChangeText={(values) => setPassword(values)}
          />
          <TextInput
            secureTextEntry={true}
            autoCapitalize="none"
            value={repeatPassword}
            style={styles.textInput}
            placeholder={textInputRepeatPassword}
            onChangeText={(values) => setRepeatPassword(values)}
          />
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => registerAccount("register-user")}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* {isTrue?<View style={styles.loading}><ActivityIndicator size="large" color="green" /></View>:null} */}
    </View>
  );

  async function registerAccount(endpoint) {
    let data = null;
    let body = {
      name: name,
      username: username,
      password: password,
      mobile: mobile,
      email: email,
    };
    if (
      name == "" ||
      mobile == "" ||
      email == "" ||
      username == "" ||
      password == "" ||
      repeatPassword == ""
    ) {
      alert(ConstantResponse.REQUIRED_FIELDS_EMPTY);
    } else if (password != repeatPassword) {
      alert(ConstantResponse.PASSWORD_UNMATCH);
    } else {
      data = await helpers.fetchData(endpoint, body);
      if (data.message.errorMessage != "") {
        alert(data.message.errorMessage);
      } else {
        alert(data.message.successMessage);
        setName("");
        setMobile("");
        setEmail("");
        setUsername("");
        setPassword("");
        setRepeatPassword("");
      }
    }
  }

  async function sendOtp(endpoint) {
    setFinalEmail(verifyEmail);
    let data = null;
    let body = {
      email: verifyEmail,
    };
    if (verifyEmail == "") {
      alert(ConstantResponse.REQUIRED_FIELDS_EMPTY);
    } else {
      data = await helpers.fetchData(endpoint, body);
      if (data.message.errorMessage != "") {
        alert(data.message.errorMessage);
      } else {
        alert(data.message.successMessage);
      }
    }
  }

  async function verifyOtp(endpoint) {
    let data = null;
    let body = {
      email: finalEmail,
      userOtp: otp,
    };
    if (otp == "") {
      alert(ConstantResponse.REQUIRED_FIELDS_EMPTY);
    } else {
      data = await helpers.fetchData(endpoint, body);
      if (data.message.errorMessage != "") {
        setOtp("");
        alert(data.message.errorMessage);
      } else {
        setOtp("");
        setVeifyEmail("");
        alert(data.message.successMessage);
        helpers.navigateTo(navigation, "Login");
      }
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  view: {
    marginTop: 40,
  },
  topView: {
    flexDirection: "row",
    height: "1%",
    alignItems: "center"
  },
  verifyAccountButton: {
    position: "absolute",
    backgroundColor: "#03759e",
    right: "3%",
    borderRadius: 5,
  },
  image: {
    width: 35,
    height: 35,
  },
  backButton: {
    paddingLeft: 20,
    width: 35,
    height: 35
  },
  verifyAccountText: {
    padding: 5,
    color: "white",
  },
  formView: {
    justifyContent: "space-between",
    alignSelf: "center",
    marginTop: "15%",
    height: "90%",
    width: "85%",
    borderColor: "white",
    borderWidth: 4,
    alignItems: "center",
    borderRadius: 8,
  },
  registerText: {
    color: "white",
    padding: 10,
    fontSize: 25,
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 4,
    color: "black",
    borderColor: "red",
    padding: 10,
    fontFamily: "normal",
    width: "80%",
  },
  registerButton: {
    backgroundColor: "#9bbec9",
    borderRadius: 5,
    width: "30%",
    marginBottom: "10%",
  },
  registerButtonText: {
    color: "black",
    padding: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  upperModal: {
    flex: 1,
  },
  upperModalTouch: {
    flex: 1,
    opacity: 0,
  },
  lowerModal: {
    flex: 0.8,
    backgroundColor: "#040c2e",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 2,
    width: "100%",
    borderColor: "grey",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verifyAccountModalText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    flex: 0.5,
  },
  emailView: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1,
    width: "80%",
    flexDirection: "row",
  },
  otpView: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1,
    width: "80%",
    flexDirection: "row",
  },
  otpText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    padding: 10,
  },
  verifyOtpButton: {
    backgroundColor: "#105906",
    borderRadius: 8,
  },
  sendOtpButton: {
    borderRadius: 8,
    backgroundColor: "#3095b3",
    underlayColor: "none",
  },
  textInputModal: {
    backgroundColor: "white",
    borderRadius: 4,
    color: "black",
    borderColor: "red",
    padding: 10,
    fontFamily: "normal",
    width: "80%",
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
