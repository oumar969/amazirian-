import { Link } from "react-router-dom";

import type { Product } from "../models/Product";
import { Stars } from "./Stars";

type ProductGridCardProps = {
  product: Product;
};

export function ProductGridCard({ product }: ProductGridCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
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

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
              {product.title}
            </h3>
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
              {product.category}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <Stars value={product.rating} />
            <span className="text-xs text-slate-500">({product.ratingCount.toLocaleString()})</span>
          </div>

          <p className="mt-2 line-clamp-2 text-xs text-slate-600">{product.description}</p>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">
                {product.price.toLocaleString()} {product.currency}
              </div>
              <div className="text-xs text-slate-500">Levering i morgen*</div>
            </div>

            <span className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
              Se
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
