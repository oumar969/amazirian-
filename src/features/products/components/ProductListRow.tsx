import { Link } from "react-router-dom";

import type { Product } from "../models/Product";
import { Stars } from "./Stars";

type ProductListRowProps = {
  product: Product;
};

export function ProductListRow({ product }: ProductListRowProps) {
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
            {product.category}
          </span>
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
          {product.price.toLocaleString()} {product.currency}
        </div>
        <Link
          to={`/products/${product.id}`}
          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Se produkt
        </Link>
      </div>
    </div>
  );
}
