import {
  useEffect,
  useState,
} from "react";

import { CartContext } from "./CartContextValue";

const CART_STORAGE_KEY = "cacao-cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      /*
       * Remove stale items saved from the old static product data
       * (ids like "product-1"). The backend only knows numeric ids,
       * so such items make the order request fail.
       */
      return parsedCart
        .filter((item) => {
          const numericId = Number(item?.id);

          return (
            Number.isInteger(numericId) &&
            numericId > 0 &&
            item.quantity > 0
          );
        })
        .map((item) => ({
          ...item,
          id: Number(item.id),
        }));
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  const addToCart = (
    product,
    quantity = 1
  ) => {
    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.id === product.id
        );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (
    productId
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.id !== productId
      )
    );
  };

  const updateQuantity = (
    productId,
    quantity
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        item.quantity,
    0
  );

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= 2500
      ? 0
      : 150;

  const total =
    subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        shipping,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}