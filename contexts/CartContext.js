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
    if (product.availability <= 0) {
      await sendPushNotification(
        "Out of Stock",
        `Product "${product.name}" is out of stock and cannot be added to the cart.`
      );
      return;
    }

    const existingItem = cart.find((item) => item.ourId === product.ourId);

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.ourId === product.ourId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    }

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
        }),
      });
      const data = await res.json();
      if (data.success) {
        await sendPushNotification(
          "Item Added to Cart",
          `Product "${product.name}" has been added to your cart.`
        );
      } else {
        console.error("Failed to save cart item to database:", data.message);
      }
    } catch (err) {
      console.error("Error adding cart item to database:", err);
    }
  };

  const removeFromCart = async (productId) => {
    const existingItem = cart.find((item) => item.ourId === productId);

    if (!existingItem) return;

    if (existingItem.quantity > 1) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.ourId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCart((prevCart) =>
        prevCart.filter((item) => item.ourId !== productId)
      );
    }

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
          data.message
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
