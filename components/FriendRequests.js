import { FlatList, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../components/styles/Style";

function FriendRequests({ setIsLoading, isLoading }) {
  const [friendRequests, setFriendRequests] = useState(null);
  const [confirmation, setConfirmation] = useState("");

  useEffect(async () => {
    const authToken = await AsyncStorage.getItem("@session_token");

    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
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
        await setFriendRequests(responseJson);
        await setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isLoading]);

  const requestResponse = async (method, userId) => {
    const authToken = await AsyncStorage.getItem("@session_token");
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${userId}`, {
      method,
      headers: {
        "X-Authorization": authToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(true);
          if (method === "POST") {
            setConfirmation("Request Accepted");
          } else {
            setConfirmation("Request Rejected");
          }
        } else {
          throw "Something went wrong";
        }
      })
      .then()
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoading === false) {
    if (friendRequests.length < 1) {
      return (
        <View style={styles.container}>
          <Text style={styles.pageHeadings}>Friend Requests</Text>
          {confirmation.length > 0 && (
            <Text style={styles.confirmationText}>{confirmation}</Text>
          )}
          <Text>You have no friend requests</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.pageHeadings}>Friend Requests</Text>
        <FlatList
          data={friendRequests}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.first_name} {item.last_name}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => requestResponse("POST", item.user_id)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => requestResponse("DELETE", item.user_id)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
      </View>
    );
  }
  return null;
}

export default FriendRequests;
