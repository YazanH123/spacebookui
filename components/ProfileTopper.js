import React, { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../components/styles/Style";

function ProfileTopper(profileId) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [friends, setFriends] = useState(null);

  useEffect(async () => {
    const authToken = await AsyncStorage.getItem("@session_token");
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${profileId.profileId}/photo`,
      {
        method: "GET",
        headers: {
          "X-Authorization": authToken,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.blob();
        }
        if (response.status === 401) {
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseBlob) => {
        const data = URL.createObjectURL(responseBlob);
        setProfilePicture(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [profileId]);

  useEffect(async () => {
    const authToken = await AsyncStorage.getItem("@session_token");
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${profileId.profileId}`,
      {
        headers: {
          "X-Authorization": authToken,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        setFirstName(responseJson.first_name);
        setLastName(responseJson.last_name);
        setFriends(responseJson.friend_count);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [profileId]);

  return (
    <View style={styles.profileTopper}>
      <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      <View>
        <Text style={styles.profileNameText}>
          {firstName} {lastName}
        </Text>
        <Text>Friends: {friends}</Text>
      </View>
    </View>
  );
}

export default ProfileTopper;
