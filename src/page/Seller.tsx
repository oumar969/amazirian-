import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { useT } from "../features/i18n/hooks/useT";
import { ProductGridCard } from "../features/products/components/ProductGridCard";
import { productCatalog } from "../features/products/services/productCatalog";

export default function Seller() {
  const { t } = useT();
  const { sellerId } = useParams<{ sellerId: string }>();

  const products = useMemo(() => productCatalog.list(), []);

  const sellerProducts = useMemo(() => {
    if (!sellerId) return [];
    return products.filter((p) => p.sellerId === sellerId);
  }, [products, sellerId]);

  const sellerName = sellerProducts[0]?.sellerName ?? sellerId ?? "";

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-slate-600">
              <Link to="/products" className="font-semibold text-indigo-600 hover:underline">
                {t("products.title")}
              </Link>
              <span className="mx-2 text-slate-400">/</span>
              <span className="text-slate-900">{t("seller.pill")}</span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{sellerName}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {t("seller.count", { count: sellerProducts.length })}
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {t("seller.back")}
          </Link>
        </div>

        {sellerProducts.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-sm text-slate-700">{t("seller.empty")}</div>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {t("seller.goToProducts")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellerProducts.map((p) => (
              <ProductGridCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
