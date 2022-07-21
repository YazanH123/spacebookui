import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native";
import Profile from "./Profile";
import SearchScreen from "./SearchScreen";
import FriendsScreen from "./FriendsScreen";
import SettingsAndInfoScreen from "./SettingsAndInfoScreen";

function MainAppScreen({ navigation }) {
  const [profileId, setProfileId] = useState();

  useEffect(async () => {
    const value = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("@user_id");
    if (value == null) {
      navigation.navigate("Login");
    }
    if (id != null) {
      setProfileId(id);
    }
  }, []);

  const Tab = createBottomTabNavigator();

  if (profileId != null) {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Profile"
          component={Profile}
          initialParams={{ profileId, refreshPage: false }}
        />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Friends" component={FriendsScreen} />
        <Tab.Screen name="Settings" component={SettingsAndInfoScreen} />
      </Tab.Navigator>
    );
  }
  return <Text>Loading</Text>;
}
export default MainAppScreen;
