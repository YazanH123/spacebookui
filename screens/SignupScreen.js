import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import styles from "../components/styles/Style";

function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [firstNameValid, setFirstNameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const logIn = () => {
    const loginData = {
      email,
      password,
    };
    console.log(JSON.stringify(loginData));
    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          navigation.navigate("Login");
        } else {
          throw "Something went wrong";
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        await AsyncStorage.setItem("@user_id", responseJson.id);
        await AsyncStorage.setItem("@session_token", responseJson.token);
        navigation.navigate("MainApp");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signUp = () => {
    if (firstName.length === 0) {
      setFirstNameError("First Name is required");
    } else {
      setFirstNameError("");
      setFirstNameValid(true);
    }

    if (lastName.length === 0) {
      setLastNameError("Last Name is required");
    } else {
      setLastNameError("");
      setLastNameValid(true);
    }

    if (email.length === 0) {
      setEmailError("Email is required");
    } else if (email.length < 6) {
      setEmailError("Email should be minimum 6 characters");
    } else if (email.indexOf(" ") >= 0) {
      setEmailError("Email cannot contain spaces");
    } else if (email.indexOf("@") === -1) {
      setEmailError("Email must contain an '@'");
    } else {
      setEmailError("");
      setEmailValid(true);
    }

    if (password.length === 0) {
      setPasswordError("Password is required");
    } else if (password.length < 6) {
      setPasswordError("Password should be minimum 6 characters");
    } else if (password.indexOf(" ") >= 0) {
      setPasswordError("Password cannot contain spaces");
    } else {
      setPasswordError("");
      setPasswordValid(true);
    }

    const signUpData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };
    console.log(JSON.stringify(signUpData));
    if (
      firstNameValid === true &&
      lastNameValid === true &&
      emailValid === true &&
      passwordValid === true
    ) {
      return fetch("http://localhost:3333/api/1.0.0/user", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          }
          if (response.status === 400) {
            return setErrorMessage("Please try again");
          }
          throw "Something went wrong";
        })
        .then((responseJson) => {
          console.log(responseJson);
          logIn();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text>First Name</Text>
      {errorMessage.length > 0 && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <TextInput
        style={styles.textInput}
        placeholder="First Name"
        onChangeText={setFirstName}
      />
      {firstNameError.length > 0 && (
        <Text style={styles.errorText}>{firstNameError}</Text>
      )}
      <Text>Last Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Last Name"
        onChangeText={setLastName}
      />
      {lastNameError.length > 0 && (
        <Text style={styles.errorText}>{lastNameError}</Text>
      )}
      <Text>Email</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Email Address"
        onChangeText={setEmail}
      />
      {emailError.length > 0 && (
        <Text style={styles.errorText}>{emailError}</Text>
      )}
      <Text>Password</Text>
      <TextInput
        style={styles.textInput}
        secureTextEntry
        placeholder="Password"
        onChangeText={setPassword}
      />
      {passwordError.length > 0 && (
        <Text style={styles.errorText}>{passwordError}</Text>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => signUp()}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SignupScreen;
