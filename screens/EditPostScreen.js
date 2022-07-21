import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import styles from "../components/styles/Style";

function EditPostScreen({ route }) {
  const profileId = route.params.post.author.user_id;
  const postId = route.params.post.post_id;

  const [postText, setPostText] = useState(null);
  const [updatedPostText, setUpdatedPostText] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(async () => {
    const authToken = await AsyncStorage.getItem("@session_token");
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${profileId}/post/${postId}`,
      {
        method: "GET",
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
          throw "401 response";
        } else {
          throw "Something went wrong";
        }
      })
      .then(async (responseJson) => {
        await setPostText(responseJson.text);
        await setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [profileId]);

  const updatePost = async () => {
    const updatedPostData = {};

    if (postText !== updatedPostText && updatedPostText !== "") {
      updatedPostData.text = updatedPostText;
    }

    const authToken = await AsyncStorage.getItem("@session_token");
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${profileId}/post/${postId}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "X-Authorization": authToken,
        },
        body: JSON.stringify(updatedPostData),
      }
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate("PostScreen", { profileId, postId });
        } else if (response.status === 401) {
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoading !== true) {
    return (
      <View style={styles.container}>
        <Header />
        <TextInput
          style={styles.textInput}
          placeholder={postText}
          onChangeText={setUpdatedPostText}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => updatePost()} style={styles.button}>
            <Text style={styles.buttonText}>Update Post</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
}

export default EditPostScreen;
