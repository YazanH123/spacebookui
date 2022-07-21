import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import styles from "../components/styles/Style";
import Header from "../components/Header";

function SettingsAndInfoScreen() {
  const navigation = useNavigation();

  const logout = async () => {
    const authToken = await AsyncStorage.getItem("@session_token");
    await AsyncStorage.removeItem("@session_token");
    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: "post",
      headers: {
        "X-Authorization": authToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate("Login");
        } else if (response.status === 401) {
          navigation.goBack();
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.settingsButtonView}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Camera")}
        >
          <Text style={styles.buttonText}>Take New Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => logout()}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default SettingsAndInfoScreen;
