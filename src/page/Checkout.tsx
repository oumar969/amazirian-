import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAddressBook } from "../features/addressBook/hooks/useAddressBook";
import { type Governorate, governorateFeesSyp } from "../features/checkout/shipping";
import { useCart } from "../features/cart/hooks/useCart";
import { useT } from "../features/i18n/hooks/useT";
import { useOrders } from "../features/orders/hooks/useOrders";
import { formatMoney, type SupportedCurrency } from "../shared/money";

function normalizePhone(raw: string): string {
  return raw.replace(/[\s()-]/g, "").replace(/^00/, "+");
}

function toWhatsAppDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export default function Checkout() {
  const { t } = useT();
  const navigate = useNavigate();
  const { items, itemCount, subtotal, clearCart } = useCart();
  const orders = useOrders();
  const addressBook = useAddressBook();

  const currency: SupportedCurrency = items[0]?.snapshot.currency ?? "SYP";
  const [status, setStatus] = useState<"idle" | "placing" | "done">("idle");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState<Governorate>("Damaskus (دمشق)");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank" | "card">("cod");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [addressLabel, setAddressLabel] = useState<string>("");
  const [saveAddress, setSaveAddress] = useState(false);

  const shopWhatsApp = (import.meta.env.VITE_WHATSAPP_PHONE as string | undefined) ?? "963000000000";
  const shopWhatsAppDigits = toWhatsAppDigits(shopWhatsApp);

  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    // Syria-friendly: delivery fee depends on governorate (SYP)
    return governorateFeesSyp[governorate] ?? 0;
  }, [items.length, governorate]);

  const total = subtotal + shipping;

  const missingShippingInfo =
    fullName.trim().length < 2 ||
    normalizePhone(phone).trim().length < 8 ||
    city.trim().length < 2 ||
    address.trim().length < 6;

  const mixedCurrency = useMemo(() => {
    const set = new Set(items.map((i) => i.snapshot.currency));
    return set.size > 1;
  }, [items]);

  function buildWhatsAppMessage(): string {
    const lines: string[] = [];
    lines.push("طلب جديد من Amazirian");
    lines.push("—");
    lines.push(`الاسم: ${fullName || "-"}`);
    lines.push(`الهاتف: ${normalizePhone(phone) || "-"}`);
    lines.push(`المحافظة: ${governorate}`);
    lines.push(`المدينة: ${city || "-"}`);
    lines.push(`العنوان: ${address || "-"}`);
    if (notes.trim()) lines.push(`ملاحظات: ${notes.trim()}`);
    lines.push("—");
    lines.push("المنتجات:");
    for (const item of items) {
      lines.push(
        `- ${item.snapshot.title} ×${item.quantity} = ${formatMoney(
          item.snapshot.price * item.quantity,
          item.snapshot.currency,
        )}`,
      );
    }
    lines.push("—");
    lines.push(`المجموع: ${formatMoney(subtotal, currency)}`);
    lines.push(`التوصيل: ${formatMoney(shipping, "SYP")}`);
    lines.push(`الإجمالي: ${formatMoney(total, currency)}`);
    lines.push("—");
    lines.push(`الدفع: ${paymentMethod === "cod" ? "عند الاستلام" : paymentMethod === "bank" ? "حوالة" : "بطاقة"}`);
    return lines.join("\n");
  }

  function openWhatsAppOrder() {
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${shopWhatsAppDigits}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function placeOrder() {
    if (items.length === 0) return;
    setStatus("placing");
    await new Promise((r) => setTimeout(r, 600));

    orders.add({
      currency,
      subtotal,
      shippingSyp: shipping,
      total,
      paymentMethod,
      shipping: {
        fullName: fullName.trim(),
        phone: normalizePhone(phone).trim(),
        governorate,
        city: city.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
      },
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        snapshot: i.snapshot,
      })),
    });

    if (saveAddress && !missingShippingInfo) {
      addressBook.upsert({
        id: selectedAddressId || "",
        label: (addressLabel || fullName || city || t("addressBook.defaultLabel")).trim(),
        fullName: fullName.trim(),
        phone: normalizePhone(phone).trim(),
        governorate,
        city: city.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
      });
    }

    clearCart();
    setStatus("done");
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t("checkout.title")}</h1>
            <p className="mt-1 text-sm text-slate-600">{t("checkout.items", { count: itemCount })}</p>
          </div>
          <Link
            to="/cart"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {t("checkout.backToCart")}
          </Link>
        </div>

        {status === "done" ? (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-900 shadow-sm">
            <div className="text-lg font-semibold">{t("checkout.thanks")}</div>
            <div className="mt-1 text-sm opacity-90">
              {t("checkout.thanksHint")}
            </div>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-5 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              {t("checkout.toProducts")}
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-700">{t("checkout.cartEmpty")}</p>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {t("checkout.goToProducts")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">{t("checkout.shipping")}</div>
                <p className="mt-1 text-xs text-slate-500">
                  {t("checkout.shippingHint")}
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <label className="text-xs font-semibold text-slate-700">{t("addressBook.saved")}</label>
                      <select
                        value={selectedAddressId}
                        onChange={(e) => {
                          const id = e.target.value;
                          setSelectedAddressId(id);
                          const addr = addressBook.addresses.find((a) => a.id === id);
                          if (!addr) return;
                          setAddressLabel(addr.label);
                          setFullName(addr.fullName);
                          setPhone(addr.phone);
                          setGovernorate(addr.governorate);
                          setCity(addr.city);
                          setAddress(addr.address);
                          setNotes(addr.notes ?? "");
                        }}
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      >
                        <option value="">{t("addressBook.none")}</option>
                        {addressBook.addresses.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAddressId("");
                          setAddressLabel("");
                          setSaveAddress(true);
                        }}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                      >
                        {t("addressBook.new")}
                      </button>

                      {selectedAddressId && (
                        <button
                          type="button"
                          onClick={() => {
                            addressBook.remove(selectedAddressId);
                            setSelectedAddressId("");
                            setAddressLabel("");
                          }}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                        >
                          {t("addressBook.remove")}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">{t("addressBook.label")}</label>
                      <input
                        value={addressLabel}
                        onChange={(e) => setAddressLabel(e.target.value)}
                        disabled={!saveAddress}
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:bg-slate-100 disabled:text-slate-500"
                        placeholder={t("addressBook.labelPlaceholder")}
                      />
                    </div>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                      <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                      <span className="font-semibold text-slate-900">{t("addressBook.saveThis")}</span>
                    </label>
                  </div>
                </div>

                {(mixedCurrency || currency !== "SYP") && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    {t("checkout.mixedCurrency")}
                  </div>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">{t("checkout.name")}</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      placeholder={t("checkout.namePlaceholder")}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">{t("checkout.phone")}</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      placeholder="+963…"
                      inputMode="tel"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">{t("checkout.governorate")}</label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value as Governorate)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    >
                      {(Object.keys(governorateFeesSyp) as Governorate[]).map((g) => (
                        <option key={g} value={g}>
                          {g} — {formatMoney(governorateFeesSyp[g], "SYP")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">{t("checkout.city")}</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      placeholder={t("checkout.cityPlaceholder")}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {saveAddress && (
                    <button
                      type="button"
                      onClick={() => {
                        if (missingShippingInfo) return;
                        const id = selectedAddressId || "";
                        addressBook.upsert({
                          id,
                          label: (addressLabel || fullName || city || t("addressBook.defaultLabel")).trim(),
                          fullName: fullName.trim(),
                          phone: normalizePhone(phone).trim(),
                          governorate,
                          city: city.trim(),
                          address: address.trim(),
                          notes: notes.trim() || undefined,
                        });
                      }}
                      disabled={missingShippingInfo}
                      className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {selectedAddressId ? t("addressBook.update") : t("addressBook.save")}
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-700">{t("checkout.address")}</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    placeholder={t("checkout.addressPlaceholder")}
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-700">{t("checkout.notes")}</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    placeholder={t("checkout.notesPlaceholder")}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">{t("checkout.order")}</div>
                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {item.snapshot.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">{t("checkout.qty", { count: item.quantity })}</div>
                      </div>
                      <div className="shrink-0 text-sm font-semibold text-slate-900">
                        {formatMoney(item.snapshot.price * item.quantity, item.snapshot.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{t("checkout.payment")}</div>

              <div className="mt-4 space-y-2">
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-3 text-sm">
                  <span className="font-semibold text-slate-900">{t("checkout.payment.cod")}</span>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-3 text-sm">
                  <span className="text-slate-700">{t("checkout.payment.bank")}</span>
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-3 text-sm">
                  <span className="text-slate-700">{t("checkout.payment.card")}</span>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                </label>
              </div>

              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>{t("checkout.subtotal")}</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(subtotal, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("checkout.shipping")}</span>
                  <span className="font-semibold text-slate-900">
                    {shipping === 0 ? t("checkout.free") : formatMoney(shipping, "SYP")}
                  </span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t("checkout.total")}</span>
                  <span className="text-base font-semibold text-slate-900">
                    {formatMoney(total, currency)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={status === "placing" || missingShippingInfo}
                className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "placing" ? t("checkout.placing") : t("checkout.place")}
              </button>

              <button
                type="button"
                onClick={openWhatsAppOrder}
                disabled={status === "placing" || missingShippingInfo}
                className="mt-3 w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("checkout.whatsapp")}
              </button>

              {missingShippingInfo && (
                <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                  {t("checkout.fillRequired")}
                </div>
              )}

              <div className="mt-4 text-xs text-slate-500">
                {t("checkout.demoNote")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
