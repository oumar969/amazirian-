import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useCart } from "../features/cart/hooks/useCart";
import { ProductGridCard } from "../features/products/components/ProductGridCard";
import { Stars } from "../features/products/components/Stars";
import { productCatalog } from "../features/products/services/productCatalog";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const allProducts = useMemo(() => productCatalog.list(), []);

  const product = allProducts.find((p) => p.id === id);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [allProducts, product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Produkt ikke fundet</h1>
          <p className="mt-2 text-sm text-slate-600">Måske er det blevet nulstillet i kataloget.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Tilbage til produkter
          </Link>
        </div>
      </div>
    );
  }

  const gallery = [product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-600">
          <Link to="/products" className="hover:underline">
            Produkter
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900">{product.category}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[4/3] bg-slate-100">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
              {gallery.map((src, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img src={src} alt="" className="h-20 w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{product.title}</h1>
              {product.prime && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Prime
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Stars value={product.rating} />
              <span className="text-sm text-slate-600">{product.rating.toFixed(1)} / 5</span>
              <span className="text-sm text-slate-400">•</span>
              <span className="text-sm text-slate-600">{product.ratingCount.toLocaleString()} anmeldelser</span>
            </div>

            <div className="mt-4 text-3xl font-semibold text-slate-900">
              {product.price.toLocaleString()} {product.currency}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-700">{product.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  addToCart(product, 1);
                  setAdded(true);
                  window.setTimeout(() => setAdded(false), 1200);
                }}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {added ? "Tilføjet ✓" : "Læg i kurv"}
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(product, 1);
                  navigate("/checkout");
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Køb nu
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Levering</span>
                <span className="font-semibold">1–2 dage</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Returnering</span>
                <span className="font-semibold">30 dage</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/products"
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                ← Tilbage til katalog
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Anmeldelser</h2>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Stars value={product.rating} />
                <span className="font-semibold text-slate-900">{product.rating.toFixed(1)}</span>
                <span className="text-slate-400">•</span>
                <span>{product.ratingCount.toLocaleString()} total</span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">Kunde #{n}</div>
                    <div className="text-xs text-slate-500">Demo</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Stars value={Math.max(3.5, Math.min(5, product.rating - (n - 2) * 0.4))} />
                    <span className="text-xs text-slate-500">Verificeret køb</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">
                    Super kvalitet til prisen. Levering var hurtig, og produktet matcher beskrivelsen.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Relaterede produkter</h2>
            <p className="mt-1 text-sm text-slate-600">Mere fra {product.category}</p>

            {related.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Ingen relaterede produkter lige nu.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <ProductGridCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
