import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import config from "../config";

const ViewProductScreen = ({ navigation }) => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    ourId: "",
  });

  const callAPI = async () => {
    try {
      const res = await fetch(`${config.ngrokUrl}/getSpecificProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({ ourId: "90" }),
      });
      const data = await res.json();
      console.log(data);
      setProductData(data.theProduct);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <Text>{"Product ID: " + productData.ourId}</Text>
      <Text>{"Name: " + productData.name}</Text>
      <Text>{"Product Price: " + productData.price}</Text>
      <TouchableOpacity style={buttonStyles.button} onPress={callAPI}>
        <Text style={buttonStyles.buttonText}>Get product details</Text>
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ViewProductScreen;
