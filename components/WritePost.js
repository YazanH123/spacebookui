import { Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import styles from "../components/styles/Style";

function WritePost({ profileId, setIsLoading }) {
  const [postText, setPostText] = useState("");
  const [postError, setPostError] = useState("");

  const postData = {
    text: postText,
  };

  const post = async () => {
    const authToken = await AsyncStorage.getItem("@session_token");
    if (postText !== "") {
      setPostError("");
      return fetch(`http://localhost:3333/api/1.0.0/user/${profileId}/post`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": authToken,
        },
        body: JSON.stringify(postData),
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          }
          if (response.status === 401) {
          } else {
            throw "Something went wrong";
          }
        })
        .then((responseJson) => {
          setIsLoading(true);
          setPostText("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setPostError("Please write a post");
  };

  return (
    <View style={styles.writePost}>
      <Text>New Post</Text>
      {postError.length > 0 && (
        <Text style={styles.errorText}>{postError}</Text>
      )}
      <TextInput
        style={styles.textInput}
        value={postText}
        placeholder="New post.."
        onChangeText={setPostText}
      />
      <TouchableOpacity style={styles.button} onPress={() => post()}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

export default WritePost;
