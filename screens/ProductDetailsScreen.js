import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import styles from "../styles";
import config from "../config";
import * as Notifications from "expo-notifications";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [productDetails, setProductDetails] = useState(product);

  useEffect(() => {
    navigation.setOptions({ title: "Product Details" });

    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const res = await fetch(`${config.ngrokUrl}/getSpecificProduct`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify({ ourId: product.ourId }),
        });
        const data = await res.json();
        if (data.success) {
          setProductDetails(data.theProduct); // Update product details
        } else {
          console.error("Failed to refresh product details:", data.theError);
        }
      } catch (err) {
        console.error("Error refreshing product details:", err);
      }
    });

    return unsubscribe;
  }, [navigation]);

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
      <Text style={styles.productText}>
        {"Product ID: " + productDetails.ourId}
      </Text>
      <Text style={styles.productText}>{"Name: " + productDetails.name}</Text>
      <Text style={styles.productText}>
        {"Category: " + productDetails.category}
      </Text>
      <Text style={styles.productText}>{"Brand: " + productDetails.brand}</Text>
      <Text style={styles.productText}>
        {"Description: " + productDetails.description}
      </Text>
      <Text style={styles.productText}>{"Color: " + productDetails.color}</Text>
      <Text style={styles.productText}>
        {"Weight: " + productDetails.weight}
      </Text>
      <Text style={styles.productText}>
        {"Availability: " + productDetails.availability}
      </Text>
      <Text style={styles.productText}>
        {"Product Price: " + productDetails.price}
      </Text>
      <TouchableOpacity
        style={buttonStyles.button}
        onPress={() =>
          navigation.navigate("EditProduct", { product: productDetails })
        }
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
