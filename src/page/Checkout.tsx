import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../features/cart/hooks/useCart";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, clearCart } = useCart();

  const currency = items[0]?.snapshot.currency ?? "DKK";
  const [status, setStatus] = useState<"idle" | "placing" | "done">("idle");

  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= 500 ? 0 : 39;
  }, [items.length, subtotal]);

  const total = subtotal + shipping;

  async function placeOrder() {
    if (items.length === 0) return;
    setStatus("placing");
    await new Promise((r) => setTimeout(r, 600));
    clearCart();
    setStatus("done");
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Checkout</h1>
            <p className="mt-1 text-sm text-slate-600">{itemCount} varer</p>
          </div>
          <Link
            to="/cart"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Tilbage til kurv
          </Link>
        </div>

        {status === "done" ? (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-900 shadow-sm">
            <div className="text-lg font-semibold">Tak for dit køb!</div>
            <div className="mt-1 text-sm opacity-90">
              Din ordre er registreret (demo). Du kan fortsætte med at shoppe.
            </div>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-5 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Til produkter
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-700">Din kurv er tom.</p>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Gå til produkter
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Din ordre</div>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {item.snapshot.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">Antal: {item.quantity}</div>
                    </div>
                    <div className="shrink-0 text-sm font-semibold text-slate-900">
                      {(item.snapshot.price * item.quantity).toLocaleString()} {item.snapshot.currency}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Betaling</div>

              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {subtotal.toLocaleString()} {currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fragt</span>
                  <span className="font-semibold text-slate-900">
                    {shipping === 0 ? "Gratis" : `${shipping.toLocaleString()} ${currency}`}
                  </span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-base font-semibold text-slate-900">
                    {total.toLocaleString()} {currency}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={status === "placing"}
                className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "placing" ? "Bestiller…" : "Placér ordre"}
              </button>

              <div className="mt-4 text-xs text-slate-500">
                Dette er en demo-checkout (ingen rigtig betaling).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
