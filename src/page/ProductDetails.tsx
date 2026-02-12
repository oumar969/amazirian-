import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useCart } from "../features/cart/hooks/useCart";
import { useFavorites } from "../features/favorites/hooks/useFavorites";
import { useT } from "../features/i18n/hooks/useT";
import { ProductGridCard } from "../features/products/components/ProductGridCard";
import { Stars } from "../features/products/components/Stars";
import { productCatalog } from "../features/products/services/productCatalog";
import { formatMoney } from "../shared/money";
import { openWhatsAppShare } from "../shared/share";
import { buildAppUrl } from "../shared/url";

export default function ProductDetails() {
  const { t } = useT();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const fav = useFavorites();
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

  const moreFromSeller = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id && p.sellerId === product.sellerId)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [allProducts, product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">{t("product.notFound")}</h1>
          <p className="mt-2 text-sm text-slate-600">{t("product.notFoundHint")}</p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {t("product.backToProducts")}
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
            {t("products.title")}
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900">{product.category}</span>
          <span className="text-slate-400">/</span>
          <Link to={`/seller/${encodeURIComponent(product.sellerId)}`} className="text-indigo-600 hover:underline">
            {product.sellerName}
          </Link>
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
              <span className="text-sm text-slate-600">
                {t("product.reviewsCount", { count: product.ratingCount.toLocaleString() })}
              </span>
            </div>

            <div className="mt-4 text-3xl font-semibold text-slate-900">
              {formatMoney(product.price, product.currency)}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-700">{product.description}</p>

            <div className="mt-4 text-sm text-slate-700">
              <span className="text-slate-500">{t("product.soldBy")} </span>
              <Link
                to={`/seller/${encodeURIComponent(product.sellerId)}`}
                className="font-semibold text-indigo-600 hover:underline"
              >
                {product.sellerName}
              </Link>
            </div>

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
                {added ? t("product.added") : t("product.addToCart")}
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(product, 1);
                  navigate("/checkout");
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                {t("product.buyNow")}
              </button>

              <button
                type="button"
                onClick={() => fav.toggle(product)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  fav.isFavorite(product.id)
                    ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                {fav.isFavorite(product.id) ? t("favorites.removeAction") : t("favorites.addAction")}
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = buildAppUrl(`/products/${product.id}`);
                  const text = `${product.title}\n${formatMoney(product.price, product.currency)}\n${url}`;
                  openWhatsAppShare(text);
                }}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                {t("share.whatsapp")}
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>{t("product.delivery")}</span>
                <span className="font-semibold">1–2 dage</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>{t("product.returns")}</span>
                <span className="font-semibold">30 dage</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/products"
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                {t("product.backToCatalog")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{t("product.reviews")}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Stars value={product.rating} />
                <span className="font-semibold text-slate-900">{product.rating.toFixed(1)}</span>
                <span className="text-slate-400">•</span>
                <span>{t("product.total", { count: product.ratingCount.toLocaleString() })}</span>
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
            <h2 className="text-lg font-semibold text-slate-900">{t("product.moreFromSellerTitle")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("product.moreFromSeller", { seller: product.sellerName })}</p>

            {moreFromSeller.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {t("product.noMoreFromSeller")}
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {moreFromSeller.map((p) => (
                  <ProductGridCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t("product.related")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("product.moreFrom", { category: product.category })}</p>

            {related.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {t("product.noRelated")}
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
