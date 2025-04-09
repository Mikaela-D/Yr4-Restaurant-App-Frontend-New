import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import styles from "../styles";
import config from "../config";
import { CartContext } from "../contexts/CartContext";

const ManageProductsScreen = ({ navigation, isDarkMode }) => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

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

  useEffect(() => {
    navigation.setOptions({ title: "Manage Products" });
    fetchProducts();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchProducts();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#f5f5f5" },
      ]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {products.map((product, index) => (
        <View
          key={product.ourId + index}
          style={[
            styles.productContainer,
            { backgroundColor: isDarkMode ? "#333" : "#fff" },
          ]}
        >
          <Text
            style={[
              styles.productText,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            {"Product ID: " + product.ourId}
          </Text>
          <Text
            style={[
              styles.productText,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            {"Name: " + product.name}
          </Text>
          <Text
            style={[
              styles.productText,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            {"Product Price: " + product.price}
          </Text>
          <TouchableOpacity
            style={[
              buttonStyles.smallButton,
              { backgroundColor: isDarkMode ? "#555" : "#89387b" },
            ]}
            onPress={() => navigation.navigate("ProductDetails", { product })}
          >
            <Text style={buttonStyles.buttonText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[buttonStyles.smallButton, { backgroundColor: "#FFD700" }]}
            onPress={() => addToCart(product)}
          >
            <Text style={[buttonStyles.buttonText, { color: "#000" }]}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={[
          buttonStyles.button,
          { backgroundColor: isDarkMode ? "#555" : "#89387b" },
        ]}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Text style={buttonStyles.buttonText}>Add New Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
  },
  smallButton: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: "50%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ManageProductsScreen;
