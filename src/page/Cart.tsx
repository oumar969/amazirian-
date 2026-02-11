import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../features/cart/hooks/useCart";

export default function Cart() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, setQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Kurv</h1>
            <p className="mt-1 text-sm text-slate-600">{itemCount} varer</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/products"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Fortsæt shopping
            </Link>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Ryd kurv
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
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
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                    {item.snapshot.imageUrl ? (
                      <img
                        src={item.snapshot.imageUrl}
                        alt={item.snapshot.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {item.snapshot.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">{item.snapshot.category}</div>
                      </div>
                      <div className="shrink-0 text-sm font-semibold text-slate-900">
                        {(item.snapshot.price * item.quantity).toLocaleString()} {item.snapshot.currency}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <label className="text-xs font-semibold text-slate-700" htmlFor={`qty-${item.productId}`}>
                        Antal
                      </label>
                      <input
                        id={`qty-${item.productId}`}
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                        className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Fjern
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Oversigt</div>

              <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {subtotal.toLocaleString()} {items[0]?.snapshot.currency ?? ""}
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-500">Levering beregnes i checkout.</div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Gå til checkout
              </button>

              <div className="mt-4 text-xs text-slate-500">
                Ved at fortsætte accepterer du vores vilkår.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
