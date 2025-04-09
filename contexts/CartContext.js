import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = async (product) => {
    setCart((prevCart) => [...prevCart, product]);

    try {
      const res = await fetch("http://127.0.0.1:3010/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.ourId,
          name: product.name,
          price: product.price,
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
