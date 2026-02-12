import { Link } from "react-router-dom";

import { useCart } from "../features/cart/hooks/useCart";
import { useFavorites } from "../features/favorites/hooks/useFavorites";
import { useT } from "../features/i18n/hooks/useT";
import { formatMoney } from "../shared/money";
import { openWhatsAppShare } from "../shared/share";
import { buildAppUrl } from "../shared/url";

export default function Favorites() {
  const { t } = useT();
  const fav = useFavorites();
  const cart = useCart();

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t("favorites.title")}</h1>
            <p className="mt-1 text-sm text-slate-600">{fav.count.toLocaleString()}</p>
          </div>

          {fav.count > 0 && (
            <button
              type="button"
              onClick={fav.clear}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              {t("favorites.clear")}
            </button>
          )}
        </div>

        {fav.items.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-700">{t("favorites.empty")}</p>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {t("favorites.goToProducts")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {fav.items.map((item) => {
              const p = item.snapshot;
              const url = buildAppUrl(`/products/${p.id}`);

              return (
                <div
                  key={item.productId}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <Link
                    to={`/products/${p.id}`}
                    className="h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:w-32"
                  >
                    <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${p.id}`}
                      className="line-clamp-2 text-sm font-semibold text-slate-900 hover:underline"
                    >
                      {p.title}
                    </Link>
                    <div className="mt-1 text-xs text-slate-600">{p.category}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      {formatMoney(p.price, p.currency)}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const text = `${p.title}\n${formatMoney(p.price, p.currency)}\n${url}`;
                        openWhatsAppShare(text);
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                      title={t("favorites.share")}
                    >
                      {t("favorites.share")}
                    </button>

                    <button
                      type="button"
                      onClick={() => cart.addToCart(p, 1)}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      {t("product.addToCart")}
                    </button>

                    <button
                      type="button"
                      onClick={() => fav.remove(item.productId)}
                      className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {t("favorites.remove")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
