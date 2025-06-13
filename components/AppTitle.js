import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AppTitle() {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>
        <Text style={styles.cat}>🐾 </Text>
        Lisez-<Text style={styles.catText}>Chat</Text> !
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 34,
    paddingBottom: 16,
    marginBottom: 0,
  },
  appName: {
    color: "#33a8ff",
    fontWeight: "bold",
    fontSize: 30,
    letterSpacing: 2,
    textAlign: "center",
  },
  cat: {
    fontSize: 27,
    color: "#ffd600",
    textShadowColor: "#e0b100",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  catText: {
    color: "#ffd600",
    fontWeight: "bold",
    fontSize: 31,
    textShadowColor: "#e0b100",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

