const BASE = "https://dummyjson.com";

// Tipos de productos (DummyJSON trae muchos más campos; acá listamos los que usamos en UI)
export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;

  description?: string;
  brand?: string;
  stock?: number;

  rating?: number;
  discountPercentage?: number;

  images?: string[];
};

// Respuesta paginada
export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

// fetch genérico
const fetchJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json() as Promise<T>;
};

// categorías
export const getCategoryList = (): Promise<string[]> =>
  fetchJson(`${BASE}/products/category-list`);

// productos (paginado)
export const getProducts = (limit = 12, skip = 0): Promise<ProductsResponse> =>
  fetchJson(`${BASE}/products?limit=${limit}&skip=${skip}`);

// productos por categoría (paginado)
export const getProductsByCategory = (
  category: string,
  limit = 12,
  skip = 0
): Promise<ProductsResponse> =>
  fetchJson(
    `${BASE}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  );

// búsqueda (paginado)
export const searchProducts = (
  q: string,
  limit = 12,
  skip = 0
): Promise<ProductsResponse> =>
  fetchJson(`${BASE}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`);

// -------- Helpers para traer TODOS los resultados (DummyJSON tiene un catálogo pequeño) --------
const fetchAll = async (fn: (limit: number, skip: number) => Promise<ProductsResponse>) => {
  const limit = 100;
  let skip = 0;
  let all: Product[] = [];

  while (true) {
    const res = await fn(limit, skip);
    all = all.concat(res.products);
    skip += res.limit;
    if (skip >= res.total) break;
  }

  return all;
};

export const getAllProducts = () => fetchAll((l, s) => getProducts(l, s));

export const getAllProductsByCategory = (category: string) =>
  fetchAll((l, s) => getProductsByCategory(category, l, s));

export const searchAllProducts = (q: string) => fetchAll((l, s) => searchProducts(q, l, s));
