import { useEffect, useMemo, useState } from "react";

import type { Product, ProductCategory } from "../models/Product";
import { productCatalog } from "../services/productCatalog";

export type ProductsView = "grid" | "list";
export type ProductsSort = "relevance" | "price_asc" | "price_desc" | "rating" | "newest";

const ALL = "Alle" as const;

function uniqueCategories(products: Product[]): ProductCategory[] {
  const set = new Set<ProductCategory>();
  for (const p of products) set.add(p.category);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function useProductsViewModel() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | typeof ALL>(ALL);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [onlyPrime, setOnlyPrime] = useState(false);
  const [sort, setSort] = useState<ProductsSort>("relevance");
  const [view, setView] = useState<ProductsView>("grid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    setAllProducts(productCatalog.list());
  }, []);

  const categories = useMemo(() => {
    const base = uniqueCategories(allProducts);
    return base.length ? base : (["Elektronik", "Tøj", "Bøger", "Hjem", "Skønhed", "Legetøj", "Sport", "Andet"] as ProductCategory[]);
  }, [allProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice.trim() ? Number(minPrice) : null;
    const max = maxPrice.trim() ? Number(maxPrice) : null;

    let list = allProducts.filter((p) => {
      if (onlyPrime && !p.prime) return false;
      if (category !== ALL && p.category !== category) return false;
      if (q) {
        const hay = `${p.title} ${p.description} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (min !== null && Number.isFinite(min) && p.price < min) return false;
      if (max !== null && Number.isFinite(max) && p.price > max) return false;
      return true;
    });

    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    // relevance: keep natural order (new items are added to front)
    return list;
  }, [allProducts, category, query, minPrice, maxPrice, onlyPrime, sort]);

  useEffect(() => {
    setPage(1);
  }, [query, category, minPrice, maxPrice, onlyPrime, sort, pageSize]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  function addProduct(input: {
    sellerName: string;
    title: string;
    description: string;
    price: number;
    currency: "DKK" | "SYP";
    imageUrl: string;
    category: ProductCategory;
    prime: boolean;
  }) {
    const created = productCatalog.add({
      sellerName: input.sellerName,
      title: input.title,
      description: input.description,
      price: input.price,
      currency: input.currency,
      imageUrl: input.imageUrl,
      category: input.category,
      prime: input.prime,
    });

    setAllProducts((prev) => [created, ...prev]);
  }

  function resetCatalog() {
    const next = productCatalog.clearAndReseed();
    setAllProducts(next);
  }

  return {
    state: {
      query,
      category,
      minPrice,
      maxPrice,
      onlyPrime,
      sort,
      view,
      page: currentPage,
      pageSize,
      total,
      totalPages,
      addOpen,
    },
    categories,
    products: pageItems,
    actions: {
      setQuery,
      setCategory,
      setMinPrice,
      setMaxPrice,
      setOnlyPrime,
      setSort,
      setView,
      setPage,
      setPageSize,
      setAddOpen,
      addProduct,
      resetCatalog,
    },
  };
}
