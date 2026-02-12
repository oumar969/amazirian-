import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../features/cart/hooks/useCart";
import { useT } from "../features/i18n/hooks/useT";
import { useOrders } from "../features/orders/hooks/useOrders";
import { formatMoney } from "../shared/money";

export default function Orders() {
  const { t } = useT();
  const { orders, clear, remove } = useOrders();
  const { addToCart } = useCart();

  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [orders]);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t("orders.title")}</h1>
            <p className="mt-1 text-sm text-slate-600">{t("orders.subtitle", { count: sorted.length })}</p>
          </div>

          {sorted.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              {t("orders.clear")}
            </button>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-700">{t("orders.empty")}</p>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {t("orders.goToProducts")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {sorted.map((o) => {
              const isOpen = expanded === o.id;
              const shortId = o.id.slice(0, 8).toUpperCase();
              const created = new Date(o.createdAt);

              return (
                <div key={o.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {t("orders.order")} #{shortId}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        {t("orders.placed")}: {created.toLocaleString()}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        {t("orders.shipTo")}: {o.shipping.city}, {o.shipping.governorate}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900">{formatMoney(o.total, o.currency)}</div>
                        <div className="text-xs text-slate-600">{t("orders.items", { count: o.items.length })}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpanded((prev) => (prev === o.id ? null : o.id))}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        {isOpen ? t("orders.hide") : t("orders.details")}
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(o.id)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      >
                        {t("orders.remove")}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="text-sm font-semibold text-slate-900">{t("orders.shipping")}</div>
                        <div className="mt-2 space-y-1 text-sm text-slate-700">
                          <div>{o.shipping.fullName}</div>
                          <div>{o.shipping.phone}</div>
                          <div>
                            {o.shipping.address}, {o.shipping.city}
                          </div>
                          <div>{o.shipping.governorate}</div>
                          {o.shipping.notes && <div className="text-slate-600">{o.shipping.notes}</div>}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-slate-900">{t("orders.summary")}</div>
                          <div className="text-xs text-slate-600">{t(`orders.payment.${o.paymentMethod}`)}</div>
                        </div>
                        <div className="mt-3 space-y-2 text-sm text-slate-700">
                          <div className="flex items-center justify-between">
                            <span>{t("orders.subtotal")}</span>
                            <span className="font-semibold text-slate-900">{formatMoney(o.subtotal, o.currency)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{t("orders.shippingFee")}</span>
                            <span className="font-semibold text-slate-900">{formatMoney(o.shippingSyp, "SYP")}</span>
                          </div>
                          <div className="h-px bg-slate-200" />
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{t("orders.total")}</span>
                            <span className="font-semibold text-slate-900">{formatMoney(o.total, o.currency)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-slate-900">{t("orders.products")}</div>
                          <button
                            type="button"
                            onClick={() => {
                              for (const item of o.items) {
                                addToCart({ id: item.productId, ...item.snapshot }, item.quantity);
                              }
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                          >
                            {t("orders.reorder")}
                          </button>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {o.items.map((it) => (
                            <Link
                              key={`${o.id}-${it.productId}`}
                              to={`/products/${it.productId}`}
                              className="rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50"
                            >
                              <div className="text-sm font-semibold text-slate-900 line-clamp-1">{it.snapshot.title}</div>
                              <div className="mt-1 text-xs text-slate-600">×{it.quantity}</div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
