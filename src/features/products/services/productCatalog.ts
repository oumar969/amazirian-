import type { Product, ProductCategory } from "../models/Product";
import { slugify } from "../../../shared/slug";

const STORAGE_KEY = "amazirian.products.v1";

function safeParseJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isProductCategory(value: unknown): value is ProductCategory {
  return (
    value === "Elektronik" ||
    value === "Tøj" ||
    value === "Bøger" ||
    value === "Hjem" ||
    value === "Skønhed" ||
    value === "Legetøj" ||
    value === "Sport" ||
    value === "Andet"
  );
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;

  return (
    typeof v.id === "string" &&
    // seller fields are migrated from older localStorage versions
    (v.sellerId === undefined || typeof v.sellerId === "string") &&
    (v.sellerName === undefined || typeof v.sellerName === "string") &&
    typeof v.title === "string" &&
    typeof v.description === "string" &&
    typeof v.price === "number" &&
    (v.currency === "DKK" || v.currency === "SYP") &&
    typeof v.imageUrl === "string" &&
    isProductCategory(v.category) &&
    typeof v.rating === "number" &&
    typeof v.ratingCount === "number" &&
    typeof v.prime === "boolean" &&
    typeof v.createdAt === "string"
  );
}

function normalizeSeller(p: Product): Product {
  const sellerName = (p.sellerName || "Amazirian").trim() || "Amazirian";
  const sellerId = (p.sellerId || slugify(sellerName) || "amazirian").trim() || "amazirian";
  return { ...p, sellerId, sellerName };
}

function uuid(): string {
  // crypto.randomUUID is supported in modern browsers
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  // Fallback: sufficiently unique for local demo
  return `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function seedProducts(): Product[] {
  const rand = mulberry32(969);
  const categories: ProductCategory[] = [
    "Elektronik",
    "Tøj",
    "Bøger",
    "Hjem",
    "Skønhed",
    "Legetøj",
    "Sport",
  ];

  const words = [
    "Premium",
    "Smart",
    "Pro",
    "Ultra",
    "Classic",
    "Eco",
    "Max",
    "Mini",
    "Plus",
    "Nordic",
    "Studio",
    "Air",
    "Flex",
  ];

  const itemsByCategory: Record<ProductCategory, string[]> = {
    Elektronik: ["Headset", "Tablet", "Smartwatch", "Laptop", "Kamera", "Powerbank"],
    "Tøj": ["T-shirt", "Hoodie", "Jeans", "Sneakers", "Jakke", "Cap"],
    "Bøger": ["Roman", "Biografi", "Kogebog", "Lærebog", "Fantasy", "Historie"],
    Hjem: ["Lampe", "Stol", "Sofapude", "Kaffemaskine", "Vase", "Tæppe"],
    Skønhed: ["Parfume", "Skincare", "Shampoo", "Makeup", "Creme", "Serum"],
    Legetøj: ["Byggesæt", "Brætspil", "Bamse", "Puslespil", "RC-bil", "Dukke"],
    Sport: ["Løbesko", "Yoga-måtte", "Håndvægte", "Drikkedunk", "Cykelhjelm", "Bold"],
    Andet: ["Gavekort", "Tilbehør", "Organizer", "Rejsekit"],
  };

  const imagePool = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60", // watch
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=60", // phone
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=60", // laptop
    "https://images.unsplash.com/photo-1520975869010-0d9b1d1f4f5a?auto=format&fit=crop&w=900&q=60", // headphones
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=60", // camera
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=60", // shoes
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=60", // tshirt
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=60", // home
    "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=60", // beauty
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=60", // toys
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=60", // sport
    "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=60", // books
  ];

  const now = Date.now();
  const list: Product[] = [];

  const sellers = [
    "Damascus Market",
    "Aleppo Style",
    "Latakia Home",
    "Homs Electronics",
    "Hama Books",
    "Tartus Sports",
    "Amazirian",
  ];

  for (let i = 0; i < 72; i++) {
    const category = pick(rand, categories);
    const item = pick(rand, itemsByCategory[category]);
    const name = `${pick(rand, words)} ${item}`;
    const sellerName = pick(rand, sellers);
    const sellerId = slugify(sellerName) || "amazirian";

    // Syria-friendly seeded prices (SYP). This is demo data.
    const basePriceSyp =
      category === "Elektronik"
        ? 1_800_000
        : category === "Tøj"
          ? 350_000
          : category === "Bøger"
            ? 120_000
            : category === "Hjem"
              ? 550_000
              : category === "Skønhed"
                ? 220_000
                : category === "Legetøj"
                  ? 300_000
                  : 250_000;

    const price = Math.round(basePriceSyp * (0.7 + rand() * 1.8));
    const rating = Math.round((3.6 + rand() * 1.3) * 10) / 10;
    const ratingCount = Math.floor(12 + rand() * 2500);
    const prime = rand() > 0.35;

    list.push({
      id: uuid(),
      sellerId,
      sellerName,
      title: name,
      description:
        "Høj kvalitet, hurtig levering og god pris. Perfekt til hverdagen — og ser godt ud i kurven.",
      price,
      currency: "SYP",
      imageUrl: pick(rand, imagePool),
      category,
      rating: clamp(rating, 0, 5),
      ratingCount,
      prime,
      createdAt: new Date(now - i * 36e5).toISOString(),
    });
  }

  return list;
}

function load(): Product[] {
  const parsed = safeParseJson(localStorage.getItem(STORAGE_KEY));
  if (Array.isArray(parsed) && parsed.every(isProduct)) {
    const normalized = (parsed as Product[]).map(normalizeSeller);
    // Migrate older versions forward so seller pages always work.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  }

  const seeded = seedProducts();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function save(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const productCatalog = {
  list(): Product[] {
    return load();
  },

  add(
    input: Omit<Product, "id" | "createdAt" | "rating" | "ratingCount" | "prime" | "sellerId"> &
      Partial<Pick<Product, "rating" | "ratingCount" | "prime">> &
      Partial<Pick<Product, "sellerName">>,
  ): Product {
    const products = load();

    const sellerName = (input.sellerName ?? "Amazirian").trim() || "Amazirian";
    const sellerId = slugify(sellerName) || "amazirian";

    const product: Product = {
      id: uuid(),
      sellerId,
      sellerName,
      title: input.title.trim(),
      description: input.description.trim(),
      price: input.price,
      currency: input.currency ?? "SYP",
      imageUrl: input.imageUrl.trim(),
      category: input.category,
      rating: clamp(input.rating ?? 4.2, 0, 5),
      ratingCount: Math.max(0, Math.floor(input.ratingCount ?? 12)),
      prime: Boolean(input.prime ?? true),
      createdAt: new Date().toISOString(),
    };

    const next = [product, ...products];
    save(next);
    return product;
  },

  clearAndReseed() {
    const seeded = seedProducts();
    save(seeded);
    return seeded;
  },
};
