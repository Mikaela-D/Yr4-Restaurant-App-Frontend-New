import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import config from "../config";

const FetchScreen = ({ navigation }) => {
  const [text, setText] = useState(". . . waiting for fetch API");

  const callAPI = async () => {
    try {
      const res = await fetch(`${config.ngrokUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({ ourId: "91" }),
      });
      const data = await res.json();
      setText(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <Text>{text}</Text>
      <TouchableOpacity style={buttonStyles.button} onPress={callAPI}>
        <Text style={buttonStyles.buttonText}>Go Fetch Some Data</Text>
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

export default FetchScreen;
