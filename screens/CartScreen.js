import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { CartContext } from "../contexts/CartContext";

const CartScreen = () => {
  const { cart, removeFromCart, fetchCartItems, clearCart } =
    useContext(CartContext);

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buyButton} onPress={clearCart}>
        <Text style={styles.buyButtonText}>Buy Items</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Your Cart</Text>
      {cart.length === 0 ? ( // Check if cart is empty
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={
            (item) =>
              item.productId
                ? item.productId.toString() // Use productId if available
                : Math.random().toString() // Fallback for undefined productId
          } // Fallback for undefined productId
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>Price: ${item.price}</Text>
              <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.productId)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  cartItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  removeButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  buyButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartScreen;
