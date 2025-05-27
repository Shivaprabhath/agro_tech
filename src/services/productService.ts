import { ProductFormData } from "@/components/products/ProductForm";

export const createProduct = async (
  productData: ProductFormData
): Promise<any> => {
  const response = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add product");
  }

  return response.json();
};

export const fetchProduct = async (
  productId: string
): Promise<ProductFormData> => {
  const response = await fetch(
    `http://localhost:5000/api/products/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch product");
  }

  return response.json();
};

export const updateProduct = async (
  productId: string,
  productData: ProductFormData
): Promise<any> => {
  const response = await fetch(
    `http://localhost:5000/api/products/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update product");
  }

  return response.json();
};

export const fetchUserProducts = async (): Promise<any[]> => {
  const response = await fetch("http://localhost:5000/api/products/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user products");
  }

  return response.json();
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const response = await fetch(
    `http://localhost:5000/api/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete product");
  }
};
