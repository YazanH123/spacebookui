import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WritePost from "./WritePost";
import PostList from "./PostList";

function Posts({ profileId, refreshPage }) {
  const [isLoading, setIsLoading] = useState(true);

  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    if (isLoading || refreshPage) {
      const authToken = await AsyncStorage.getItem("@session_token");
      return fetch(`http://localhost:3333/api/1.0.0/user/${profileId}/post`, {
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
          await setPosts(responseJson);
          await setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoading, refreshPage]);

  return (
    <>
      <WritePost profileId={profileId} setIsLoading={setIsLoading} />
      <PostList
        profileId={profileId}
        posts={posts}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refreshPage={refreshPage}
      />
    </>
  );
}

export default Posts;
