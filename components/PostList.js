import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import styles from "../components/styles/Style";

function PostList({ profileId, posts, isLoading, setIsLoading, refreshPage }) {
  const navigation = useNavigation();

  const [buttonError, setButtonError] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState();
  const [userId, setUserId] = useState(0);

  useEffect(async () => {
    setUserId(await AsyncStorage.getItem("@user_id"));
    if (userId === profileId) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [userId, profileId]);

  const likePost = async (postId) => {
    setButtonError("");
    const authToken = await AsyncStorage.getItem("@session_token");

    if (isOwnProfile) {
      setButtonError("You cannot like your own post.");
    } else {
      return fetch(
        `http://localhost:3333/api/1.0.0/user/${profileId}/post/${postId}/like`,
        {
          method: "POST",
          headers: {
            "X-Authorization": authToken,
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(true);
          } else if (response.status === 401) {
            throw "401 response";
          } else {
            throw "Something went wrong";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const unlikePost = async (postId) => {
    setButtonError("");
    const authToken = await AsyncStorage.getItem("@session_token");
    if (isOwnProfile) {
      setButtonError("You cannot unlike your own post.");
    } else {
      return fetch(
        `http://localhost:3333/api/1.0.0/user/${profileId}/post/${postId}/like`,
        {
          method: "DELETE",
          headers: {
            "X-Authorization": authToken,
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(true);
          } else if (response.status === 401) {
            throw "401 response";
          } else {
            throw "Something went wrong";
          }
        })
        .then((responseJson) => {})
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const editPost = async (profileId, postId) => {
    setButtonError("");
    if (!isOwnProfile) {
      setButtonError("You can only edit/delete posts you are the author of.");
    } else {
      navigation.navigate("PostScreen", { profileId, postId });
    }
  };

  const getDateOfPost = (timestamp) => {
    const d = new Date(timestamp);
    const date = `${d.getDate()}-${d.getUTCMonth()}-${d.getFullYear()}`;
    return date;
  };

  if (isLoading === false) {
    return (
      <ScrollView style={styles.container}>
        {buttonError.length > 0 && (
          <Text style={styles.errorText}>{buttonError}</Text>
        )}
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.postListItem}>
              <Text style={styles.postText}>{item.text}</Text>
              <Text style={styles.postAuthor}>
                {item.author.first_name} {item.author.last_name} -{" "}
                {getDateOfPost(item.timestamp).toString()}
              </Text>
              <Text>Likes: {item.numLikes}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => likePost(item.post_id)}
                >
                  <Text style={styles.buttonText}>Like Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => unlikePost(item.post_id)}
                >
                  <Text style={styles.buttonText}>Unlike Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => editPost(profileId, item.post_id)}
                >
                  <Text style={styles.buttonText}>View Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.post_id.toString()}
        />
      </ScrollView>
    );
  }
  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
}

export default PostList;
