import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ProfileTopper from "../components/ProfileTopper";
import Posts from "../components/Posts";
import Header from "../components/Header";
import styles from "../components/styles/Style";

function Profile({ route }) {
  const navigation = useNavigation();
  const {
    params: { profileId, refreshPage },
  } = route;
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(async () => {
    const userId = await AsyncStorage.getItem("@user_id");
    if (userId !== profileId) {
      setIsOwnProfile(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.container}>
        <ProfileTopper profileId={profileId} />
        <Posts profileId={profileId} refreshPage={refreshPage} />
        {!isOwnProfile && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

export default Profile;
