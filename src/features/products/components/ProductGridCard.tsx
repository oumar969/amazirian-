import { Link } from "react-router-dom";

import type { Product } from "../models/Product";
import { Stars } from "./Stars";
import { formatMoney } from "../../../shared/money";
import { useFavorites } from "../../favorites/hooks/useFavorites";
import { useT } from "../../i18n/hooks/useT";

type ProductGridCardProps = {
  product: Product;
};

export function ProductGridCard({ product }: ProductGridCardProps) {
  const { t } = useT();
  const fav = useFavorites();
  const inFav = fav.isFavorite(product.id);
  const categoryLabel = t(`category.${product.category}`);
  const displayCategory = categoryLabel === `category.${product.category}` ? product.category : categoryLabel;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative">
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            {product.prime && (
              <span className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow">
                Prime
              </span>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={() => fav.toggle(product)}
          className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm shadow-sm transition ${
            inFav
              ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          aria-label={inFav ? t("favorites.removeAction") : t("favorites.addAction")}
          title={inFav ? t("favorites.removeAction") : t("favorites.addAction")}
        >
          {inFav ? "♥" : "♡"}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/products/${product.id}`}
            className="line-clamp-2 text-sm font-semibold text-slate-900 hover:underline"
          >
            {product.title}
          </Link>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
            {displayCategory}
          </span>
        </div>

        <div className="mt-1 text-xs text-slate-600">
          <span className="text-slate-500">{t("product.soldBy")} </span>
          <Link
            to={`/seller/${encodeURIComponent(product.sellerId)}`}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {product.sellerName}
          </Link>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <Stars value={product.rating} />
          <span className="text-xs text-slate-500">({product.ratingCount.toLocaleString()})</span>
        </div>

        <p className="mt-2 line-clamp-2 text-xs text-slate-600">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              {formatMoney(product.price, product.currency)}
            </div>
            <div className="text-xs text-slate-500">{t("product.deliveryTomorrow")}</div>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
          >
            {t("product.see")}
          </Link>
        </div>
      </div>
    </div>
  );
}
