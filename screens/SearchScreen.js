import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../components/styles/Style";
import Header from "../components/Header";

function SearchScreen() {
  const [searchParam, setSearchParam] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [resultsRemaining, setResultsRemaining] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchLoading, setSearchLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [userId, setUserId] = useState(0);
  const [confirmation, setConfirmation] = useState("");
  let fetchUrl = "http://localhost:3333/api/1.0.0/search?limit=10";

  useEffect(async () => {
    setUserId(await AsyncStorage.getItem("@user_id"));
  }, [userId]);

  const search = async (concat) => {
    const authToken = await AsyncStorage.getItem("@session_token");
    return fetch(fetchUrl, {
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
        if (responseJson.length > 0) {
          setResultsRemaining(true);
        } else {
          setResultsRemaining(false);
        }
        setSearchResults(
          concat ? [...searchResults, ...responseJson] : responseJson
        );
        setSearchLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const initialSearch = async () => {
    await setSearchResults([]);

    setOffset(0);
    if (searchParam) {
      fetchUrl = `${fetchUrl}&q=${searchParam}`;
    }

    await search(fetchUrl, false);
  };

  const showMore = async () => {
    fetchUrl = `${fetchUrl}&offset=${offset + 10}`;
    setOffset(offset + 10);
    if (searchParam) {
      fetchUrl = `${fetchUrl}&q=${searchParam}`;
    }
    await search(fetchUrl, true);
  };

  const sendFriendRequest = async (id) => {
    setConfirmation("");
    const authToken = await AsyncStorage.getItem("@session_token");
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends/`, {
      method: "POST",
      headers: {
        "X-Authorization": authToken,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          return setConfirmation("Request Sent");
        }
        if (response.status === 403) {
          return setSearchError(
            "You are already friends/have a pending request with this user."
          );
        }
        throw "Something went wrong";
      })
      .then(() => {
        setSearchLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TextInput
        style={styles.textInput}
        placeholder="Search..."
        onChangeText={setSearchParam}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => initialSearch()}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      {searchError.length > 0 && (
        <Text style={styles.errorText}>{searchError}</Text>
      )}
      {confirmation.length > 0 && (
        <Text style={styles.confirmationText}>Request Sent</Text>
      )}
      <ScrollView style={styles.container}>
        <FlatList
          data={searchResults}
          extraData={searchLoading}
          renderItem={({ item }) =>
            item.user_id != userId ? (
              <View style={styles.searchResults}>
                <Text>
                  {item.user_givenname} {item.user_familyname}
                </Text>
                <TouchableOpacity
                  onPress={() => sendFriendRequest(item.user_id)}
                  style={styles.searchButton}
                >
                  <Text style={styles.buttonText}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          keyExtractor={(item) => item.user_id.toString()}
        />
      </ScrollView>
      {resultsRemaining && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => showMore()}
          >
            <Text style={styles.buttonText}>Show more</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
export default SearchScreen;
