import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import styles from "../styles";
import config from "../config";
import * as Notifications from "expo-notifications";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: "Product Details" });
  }, []);

  const sendPushNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { userName: "Mikaela" }, // Hardcoded userName
      },
      trigger: null, // Immediate notification
    });
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${config.ngrokUrl}/deleteSpecificProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({ ourId: product.ourId }),
      });
      const data = await res.json();
      if (data.success) {
        console.log("Product deleted successfully.");
        await sendPushNotification(
          "Product Deleted",
          `Product "${product.name}" has been deleted successfully.`
        );
        navigation.navigate("ManageProducts");
      } else {
        console.log("Failed to delete product:", data.theError);
        await sendPushNotification(
          "Error",
          `Failed to delete product "${product.name}".`
        );
      }
    } catch (err) {
      console.log(err);
      await sendPushNotification(
        "Error",
        "An error occurred while deleting the product."
      );
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete product ${product.name}?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: handleDelete,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productText}>{"Product ID: " + product.ourId}</Text>
      <Text style={styles.productText}>{"Name: " + product.name}</Text>
      <Text style={styles.productText}>{"Category: " + product.category}</Text>
      <Text style={styles.productText}>{"Brand: " + product.brand}</Text>
      <Text style={styles.productText}>
        {"Description: " + product.description}
      </Text>
      <Text style={styles.productText}>{"Color: " + product.color}</Text>
      <Text style={styles.productText}>{"Weight: " + product.weight}</Text>
      <Text style={styles.productText}>
        {"Availability: " + product.availability}
      </Text>
      <Text style={styles.productText}>
        {"Product Price: " + product.price}
      </Text>
      <TouchableOpacity
        style={buttonStyles.button}
        onPress={() => navigation.navigate("EditProduct", { product })}
      >
        <Text style={buttonStyles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={buttonStyles.button} onPress={confirmDelete}>
        <Text style={buttonStyles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: "#89387b",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetailsScreen;
