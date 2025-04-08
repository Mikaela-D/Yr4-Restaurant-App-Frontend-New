import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation, toggleTheme, isDarkMode }) => {
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#000" : "#f5f5f5" }]}>
      <Text style={[styles.welcomeText, { color: isDarkMode ? "#fff" : "#000" }]}>
        Welcome,
      </Text>
      <Text style={[styles.descriptionText, { color: isDarkMode ? "#ccc" : "#000" }]}>
        This is a inventory App where you can create, read, update, and delete
        your kicthen goods.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("All Products")}
      >
        <Text style={styles.buttonText}>All Products</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ManageProducts")}
      >
        <Text style={styles.buttonText}>Manage Products</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NearbyStores")}
      >
        <Text style={styles.buttonText}>Find Nearby Grocery Stores</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TrackInventory")}
      >
        <Text style={styles.buttonText}>Track Inventory with Images</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Text style={styles.buttonText}>
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#89387b",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;