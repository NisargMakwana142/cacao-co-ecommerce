import {
  useEffect,
  useState,
} from "react";

import { ProductContext } from "./ProductContextValue";

import { productApi } from "../api/api";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await productApi.getAll();

      setProducts(data);
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );

      setError(
        error.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (
    product
  ) => {
    const newProduct =
      await productApi.create({
        ...product,

        price: Number(
          product.price
        ),

        stock: Number(
          product.stock
        ),

        isNew: Boolean(
          product.isNew
        ),
      });

    setProducts(
      (currentProducts) => [
        newProduct,
        ...currentProducts,
      ]
    );

    return newProduct;
  };

  const updateProduct = async (
    id,
    updatedProduct
  ) => {
    const updated =
      await productApi.update(
        id,
        {
          ...updatedProduct,

          price: Number(
            updatedProduct.price
          ),

          stock: Number(
            updatedProduct.stock
          ),

          isNew: Boolean(
            updatedProduct.isNew
          ),
        }
      );

    setProducts(
      (currentProducts) =>
        currentProducts.map(
          (product) =>
            product.id === id
              ? updated
              : product
        )
    );

    return updated;
  };

  const deleteProduct = async (
    id
  ) => {
    await productApi.delete(id);

    setProducts(
      (currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !== id
        )
    );
  };

  const getProduct = (id) => {
    return products.find(
      (product) =>
        String(product.id) ===
        String(id)
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,

        loading,

        error,

        addProduct,

        updateProduct,

        deleteProduct,

        getProduct,

        refreshProducts:
          loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}