import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import styles from "../components/styles/Style";

function PostScreen({ route }) {
  const { profileId } = route.params;
  const { postId } = route.params;

  const [post, setPost] = useState(null);
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
        await setPost(responseJson);
        await setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [profileId]);

  const editPost = (post) => {
    navigation.navigate("EditPostScreen", { post });
  };

  const deletePost = async (post) => {
    const authToken = await AsyncStorage.getItem("@session_token");
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${profileId}/post/${postId}`,
      {
        method: "delete",
        headers: {
          "X-Authorization": authToken,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate("Profile", { profileId: post.author.user_id });
        } else if (response.status === 401) {
          console.log("Post Could not be deleted");
        } else {
          throw "Something went wrong";
        }
      })
      .then()
      .catch((error) => {
        console.log(error);
      });
  };

  const getDateOfPost = (timestamp) => {
    const d = new Date(timestamp);
    const date = `${d.getDate()}-${d.getUTCMonth()}-${d.getFullYear()}`;
    return date;
  };

  if (isLoading !== true) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.postText}>{post.text}</Text>
        <Text style={styles.postAuthor}>
          {post.author.first_name} {post.author.last_name} -{" "}
          {getDateOfPost(post.timestamp).toString()}
        </Text>
        <Text>Likes: {post.numLikes}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => editPost(post)}
          >
            <Text style={styles.buttonText}>Edit Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => deletePost(post)}
          >
            <Text style={styles.buttonText}>Delete Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Profile", { profileId, refreshPage: true })
            }
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

export default PostScreen;
