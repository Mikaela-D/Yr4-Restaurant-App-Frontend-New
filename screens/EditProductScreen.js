import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import styles from "../styles";
import config from "../config";

const EditProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  useEffect(() => {
    navigation.setOptions({ title: "Edit Product" });
  }, []);

  const handleChange = (name, value) => {
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${config.ngrokUrl}/updateSpecificProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      if (data.success) {
        navigation.navigate("ProductDetails", { product: updatedProduct });
      } else {
        console.log("Failed to update product:", data.theError);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Edit Product</Text>
      <TextInput
        placeholder="Name"
        value={updatedProduct.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        placeholder="Price"
        value={updatedProduct.price}
        onChangeText={(value) => handleChange("price", value)}
      />
      <TextInput
        placeholder="Category"
        value={updatedProduct.category}
        onChangeText={(value) => handleChange("category", value)}
      />
      <TextInput
        placeholder="Brand"
        value={updatedProduct.brand}
        onChangeText={(value) => handleChange("brand", value)}
      />
      <TextInput
        placeholder="Description"
        value={updatedProduct.description}
        onChangeText={(value) => handleChange("description", value)}
      />
      <TextInput
        placeholder="Color"
        value={updatedProduct.color}
        onChangeText={(value) => handleChange("color", value)}
      />
      <TextInput
        placeholder="Weight"
        value={updatedProduct.weight}
        onChangeText={(value) => handleChange("weight", value)}
      />
      <TextInput
        placeholder="Availability"
        value={updatedProduct.availability}
        onChangeText={(value) => handleChange("availability", value)}
      />
      <TouchableOpacity style={buttonStyles.button} onPress={handleSubmit}>
        <Text style={buttonStyles.buttonText}>Update Product</Text>
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

export default EditProductScreen;
