import React from "react";
import { View, Text } from "react-native";
import styles from "../components/styles/Style";

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>SPACEBOOK-UI</Text>
    </View>
  );
}

export default Header;
