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
import * as Notifications from "expo-notifications";

const AddProductScreen = ({ navigation, isDarkMode }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    description: "",
    color: "",
    weight: "",
    availability: "",
  });
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: "Add Product" });
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${config.ngrokUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setProducts(data.Products);
    } catch (err) {
      console.log(err);
    }
  };

  const generateUniqueId = () => {
    const ids = products.map((p) => p.ourId);
    let newId = 1;
    while (ids.includes(newId.toString())) {
      newId++;
    }
    return newId.toString();
  };

  const handleChange = (name, value) => {
    setProduct({ ...product, [name]: value });
  };

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

  const handleSubmit = async () => {
    const {
      name,
      price,
      category,
      brand,
      description,
      color,
      weight,
      availability,
    } = product;
    if (
      !name ||
      !price ||
      !category ||
      !brand ||
      !description ||
      !color ||
      !weight ||
      !availability
    ) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");
    const newProduct = { ...product, ourId: generateUniqueId() };
    try {
      const res = await fetch(`${config.ngrokUrl}/addProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (data.success) {
        console.log("Product added successfully.");
        await sendPushNotification(
          "Product Added",
          `Product "${newProduct.name}" has been added successfully.`
        );
        navigation.navigate("ManageProducts", { refresh: true });
      } else {
        console.log("Failed to add product:", data.theError);
        await sendPushNotification(
          "Error",
          `Failed to add product "${newProduct.name}".`
        );
      }
    } catch (err) {
      console.log(err);
      await sendPushNotification(
        "Error",
        "An error occurred while adding the product."
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#f5f5f5" },
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
        Add New Product
      </Text>
      {error ? (
        <Text
          style={[
            styles.errorText,
            { color: isDarkMode ? "#ff6b6b" : "#ff0000" },
          ]}
        >
          {error}
        </Text>
      ) : null}
      <TextInput
        placeholder="Name"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={[
          styles.input,
          {
            color: isDarkMode ? "#fff" : "#000",
            borderColor: isDarkMode ? "#555" : "#ccc",
          },
        ]}
        value={product.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        placeholder="Price"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={[
          styles.input,
          {
            color: isDarkMode ? "#fff" : "#000",
            borderColor: isDarkMode ? "#555" : "#ccc",
          },
        ]}
        value={product.price}
        onChangeText={(value) => handleChange("price", value)}
      />
      <TextInput
        placeholder="Category"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={[
          styles.input,
          {
            color: isDarkMode ? "#fff" : "#000",
            borderColor: isDarkMode ? "#555" : "#ccc",
          },
        ]}
        value={product.category}
        onChangeText={(value) => handleChange("category", value)}
      />
      <TextInput
        placeholder="Brand"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={[
          styles.input,
          {
            color: isDarkMode ? "#fff" : "#000",
            borderColor: isDarkMode ? "#555" : "#ccc",
          },
        ]}
        value={product.brand}
        onChangeText={(value) => handleChange("brand", value)}
      />
      <TextInput
        placeholder="Description"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={[
          styles.input,
          {
            color: isDarkMode ? "#fff" : "#000",
            borderColor: isDarkMode ? "#555" : "#ccc",
          },
        ]}
        value={product.description}
        onChangeText={(value) => handleChange("description", value)}
      />
      <TextInput
        placeholder="Color"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={[
          styles.input,
          {
            color: isDarkMode ? "#fff" : "#000",
            borderColor: isDarkMode ? "#555" : "#ccc",
          },
        ]}
        value={product.color}
        onChangeText={(value) => handleChange("color", value)}
      />
      <TextInput
        placeholder="Weight"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={[
          styles.input,
          {
            color: isDarkMode ? "#fff" : "#000",
            borderColor: isDarkMode ? "#555" : "#ccc",
          },
        ]}
        value={product.weight}
        onChangeText={(value) => handleChange("weight", value)}
      />
      <TextInput
        placeholder="Availability"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={[
          styles.input,
          {
            color: isDarkMode ? "#fff" : "#000",
            borderColor: isDarkMode ? "#555" : "#ccc",
          },
        ]}
        value={product.availability}
        onChangeText={(value) => handleChange("availability", value)}
      />
      <TouchableOpacity style={buttonStyles.button} onPress={handleSubmit}>
        <Text style={buttonStyles.buttonText}>Add Product</Text>
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

export default AddProductScreen;
