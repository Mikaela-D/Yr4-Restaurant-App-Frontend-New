import React, { createContext, useState } from "react";
import config from "../config";
import * as Notifications from "expo-notifications";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const sendPushNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  };

  const addToCart = async (product) => {
    setCart((prevCart) => [...prevCart, product]);

    try {
      const res = await fetch(`${config.ngrokUrl}/addToCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          productId: product.ourId,
          name: product.name,
          price: product.price,
          category: product.category,
          brand: product.brand,
          description: product.description,
          color: product.color,
          weight: product.weight,
          availability: product.availability,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await sendPushNotification(
          "Item Added to Cart",
          `Product "${product.name}" has been added to your cart.`
        );
      } else {
        console.error("Failed to save cart item to database:", data.theError);
      }
    } catch (err) {
      console.error("Error adding cart item to database:", err);
    }
  };

  const removeFromCart = async (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.ourId !== productId));

    try {
      const res = await fetch(`${config.ngrokUrl}/removeFromCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!data.success) {
        console.error(
          "Failed to remove cart item from database:",
          data.theError
        );
      }
    } catch (err) {
      console.error("Error removing cart item from database:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
