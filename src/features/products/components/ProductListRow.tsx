import { Link } from "react-router-dom";

import type { Product } from "../models/Product";
import { Stars } from "./Stars";
import { formatMoney } from "../../../shared/money";
import { useFavorites } from "../../favorites/hooks/useFavorites";
import { useT } from "../../i18n/hooks/useT";

type ProductListRowProps = {
  product: Product;
};

export function ProductListRow({ product }: ProductListRowProps) {
  const { t } = useT();
  const fav = useFavorites();
  const inFav = fav.isFavorite(product.id);
  const categoryLabel = t(`category.${product.category}`);
  const displayCategory = categoryLabel === `category.${product.category}` ? product.category : categoryLabel;

  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Link
        to={`/products/${product.id}`}
        className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100"
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </Link>

      <div className="min-w-0 flex-1">
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

        <div className="mt-1 flex items-center gap-2 text-sm">
          <Stars value={product.rating} />
          <span className="text-xs text-slate-500">({product.ratingCount.toLocaleString()})</span>
          {product.prime && (
            <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-700">
              Prime
            </span>
          )}
        </div>

        <p className="mt-2 line-clamp-2 text-xs text-slate-600">{product.description}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between">
        <div className="text-lg font-semibold text-slate-900">
          {formatMoney(product.price, product.currency)}
        </div>

        <button
          type="button"
          onClick={() => fav.toggle(product)}
          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            inFav
              ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
          }`}
          aria-label={inFav ? t("favorites.removeAction") : t("favorites.addAction")}
          title={inFav ? t("favorites.removeAction") : t("favorites.addAction")}
        >
          {inFav ? "♥" : "♡"}
        </button>

        <Link
          to={`/products/${product.id}`}
          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          {t("product.seeProduct")}
        </Link>
      </div>
    </div>
  );
}
