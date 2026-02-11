import { useMemo, useState } from "react";

import type { ProductCategory } from "../models/Product";

type AddProductModalProps = {
  open: boolean;
  categories: ProductCategory[];
  onClose: () => void;
  onAdd: (input: {
    title: string;
    description: string;
    price: number;
    currency: "DKK" | "SYP";
    imageUrl: string;
    category: ProductCategory;
    prime: boolean;
  }) => void;
};

export function AddProductModal({ open, categories, onClose, onAdd }: AddProductModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [currency, setCurrency] = useState<"DKK" | "SYP">("DKK");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<ProductCategory>(categories[0] ?? "Andet");
  const [prime, setPrime] = useState(true);

  const canSubmit = useMemo(() => {
    const numericPrice = Number(price);
    return (
      title.trim().length >= 2 &&
      description.trim().length >= 8 &&
      Number.isFinite(numericPrice) &&
      numericPrice > 0 &&
      imageUrl.trim().length >= 8
    );
  }, [title, description, price, imageUrl]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Tilføj produkt"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Tilføj produkt</h3>
            <p className="text-sm text-slate-600">Det gemmes lokalt (demo) via localStorage.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Luk
          </button>
        </div>

        <form
          className="grid gap-4 px-6 py-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onAdd({
              title: title.trim(),
              description: description.trim(),
              price: Number(price),
              currency,
              imageUrl: imageUrl.trim(),
              category,
              prime,
            });
            setTitle("");
            setDescription("");
            setPrice("");
            setImageUrl("");
            setCurrency("DKK");
            setCategory(categories[0] ?? "Andet");
            setPrime(true);
            onClose();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-900">Titel</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
                placeholder="fx Premium Headset"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-900">Kategori</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm font-semibold text-slate-900">Beskrivelse</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
              placeholder="Kort og præcis beskrivelse…"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-900">Pris</span>
              <input
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
                placeholder="299"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-900">Valuta</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "DKK" | "SYP")}
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
              >
                <option value="DKK">DKK</option>
                <option value="SYP">SYP</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
              <input
                type="checkbox"
                checked={prime}
                onChange={(e) => setPrime(e.target.checked)}
              />
              <span className="text-sm font-semibold text-slate-900">Prime</span>
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm font-semibold text-slate-900">Billede URL</span>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
              placeholder="https://…"
            />
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Annuller
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Tilføj produkt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
