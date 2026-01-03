const BASE = "https://dummyjson.com";

// export de tipos de productos
export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  rating?: number;
  discountPercentage?: number;
};

// export de respuesta de productos, esto incluye la paginación de los productos
export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

// promise genérica para fetch
const fetchJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json() as Promise<T>;
};

// export de categorías para productos
export const getCategoryList = (): Promise<string[]> =>
  fetchJson(`${BASE}/products/category-list`);

// export de productos, get para traer productos
export const getProducts = (limit = 12, skip = 0): Promise<ProductsResponse> =>
  fetchJson(`${BASE}/products?limit=${limit}&skip=${skip}`);

// productos x categoría
export const getProductsByCategory = (
  category: string,
  limit = 12,
  skip = 0
): Promise<ProductsResponse> =>
  fetchJson(
    `${BASE}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  );

// export de productos, búsqueda
export const searchProducts = (
  q: string,
  limit = 12,
  skip = 0
): Promise<ProductsResponse> =>
  fetchJson(`${BASE}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`);
