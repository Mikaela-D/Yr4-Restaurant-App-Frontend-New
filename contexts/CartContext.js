import React, { createContext, useState } from "react";
import config from "../config";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

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
      if (!data.success) {
        console.error("Failed to save cart item to database:", data.theError);
      }
    } catch (err) {
      console.error("Error adding cart item to database:", err);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.ourId !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
