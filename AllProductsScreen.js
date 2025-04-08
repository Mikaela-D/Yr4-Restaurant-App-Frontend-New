import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import styles from "./styles";
import config from "./config";

const AllProductsScreen = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <View style={styles.container}>
      <Button title="Get All Products" onPress={fetchProducts} />
      {products.map((product, index) => (
        <View key={product.ourId + index} style={styles.productContainer}>
          <Text style={styles.productText}>{"Name: " + product.name}</Text>
          <Text style={styles.productText}>
            {"Product ID: " + product.ourId}
          </Text>
          <Text style={styles.productText}>
            {"Category: " + product.category}
          </Text>
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
        </View>
      ))}
    </View>
  );
};

export default AllProductsScreen;
