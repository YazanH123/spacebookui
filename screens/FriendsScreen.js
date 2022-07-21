import { View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendsList from "../components/FriendsList";
import FriendRequests from "../components/FriendRequests";
import Header from "../components/Header";
import styles from "../components/styles/Style";

function FriendsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);

  useEffect(async () => {
    const authToken = await AsyncStorage.getItem("@session_token");
    const userId = await AsyncStorage.getItem("@user_id");
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/friends`, {
      method: "GET",
      headers: {
        "X-Authorization": authToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          throw "401 response";
        } else {
          throw "Something went wrong";
        }
      })
      .then(async (responseJson) => {
        await setFriends(responseJson);
        await setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Header />
      <FriendsList isLoading={isLoading} friends={friends} />
      <FriendRequests isLoading={isLoading} setIsLoading={setIsLoading} />
    </View>
  );
}

export default FriendsScreen;
