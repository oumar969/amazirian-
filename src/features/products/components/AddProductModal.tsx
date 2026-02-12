import { useMemo, useState } from "react";

import type { ProductCategory } from "../models/Product";
import { useT } from "../../i18n/hooks/useT";

type AddProductModalProps = {
  open: boolean;
  categories: ProductCategory[];
  onClose: () => void;
  onAdd: (input: {
    sellerName: string;
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
  const { t } = useT();
  const [sellerName, setSellerName] = useState("Amazirian");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [currency, setCurrency] = useState<"DKK" | "SYP">("SYP");
  const [imageUrl, setImageUrl] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [category, setCategory] = useState<ProductCategory>(categories[0] ?? "Andet");
  const [prime, setPrime] = useState(true);

  async function fileToDataUrl(file: File): Promise<string> {
    const maxSide = 1200;
    const quality = 0.82;

    // Decode
    let bitmap: ImageBitmap | null = null;
    if ("createImageBitmap" in window) {
      try {
        bitmap = await createImageBitmap(file);
      } catch {
        bitmap = null;
      }
    }

    const img = bitmap
      ? null
      : await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error("Kunne ikke læse billedet."));
          el.src = URL.createObjectURL(file);
        });

    const width = bitmap ? bitmap.width : img!.naturalWidth;
    const height = bitmap ? bitmap.height : img!.naturalHeight;

    const scale = Math.min(1, maxSide / Math.max(width, height));
    const outW = Math.max(1, Math.round(width * scale));
    const outH = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas ikke understøttet.");

    ctx.drawImage(bitmap ?? img!, 0, 0, outW, outH);

    if (img) URL.revokeObjectURL(img.src);
    if (bitmap) bitmap.close();

    // Use jpeg for broad compatibility.
    return canvas.toDataURL("image/jpeg", quality);
  }

  const effectiveImageUrl = imageMode === "upload" ? uploadedImage : imageUrl;

  const canSubmit = useMemo(() => {
    const numericPrice = Number(price);
    return (
      sellerName.trim().length >= 2 &&
      title.trim().length >= 2 &&
      description.trim().length >= 8 &&
      Number.isFinite(numericPrice) &&
      numericPrice > 0 &&
      effectiveImageUrl.trim().length >= 8
    );
  }, [sellerName, title, description, price, effectiveImageUrl]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("addProduct.aria")}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{t("addProduct.title")}</h3>
            <p className="text-sm text-slate-600">{t("addProduct.subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            {t("addProduct.close")}
          </button>
        </div>

        <form
          className="grid gap-4 px-6 py-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onAdd({
              sellerName: sellerName.trim(),
              title: title.trim(),
              description: description.trim(),
              price: Number(price),
              currency,
              imageUrl: effectiveImageUrl.trim(),
              category,
              prime,
            });
            setSellerName("Amazirian");
            setTitle("");
            setDescription("");
            setPrice("");
            setImageUrl("");
            setUploadedImage("");
            setImageError("");
            setImageMode("url");
            setCurrency("DKK");
            setCategory(categories[0] ?? "Andet");
            setPrime(true);
            onClose();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-900">{t("addProduct.field.seller")}</span>
              <input
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
                placeholder={t("addProduct.field.sellerPlaceholder")}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-900">{t("addProduct.field.title")}</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
                placeholder={t("addProduct.field.titlePlaceholder")}
              />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm font-semibold text-slate-900">{t("addProduct.field.category")}</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {(() => {
                    const label = t(`category.${c}`);
                    return label === `category.${c}` ? c : label;
                  })()}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-semibold text-slate-900">{t("addProduct.field.description")}</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
              placeholder={t("addProduct.field.descriptionPlaceholder")}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-900">{t("addProduct.field.price")}</span>
              <input
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
                placeholder="299"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-900">{t("addProduct.field.currency")}</span>
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
              <span className="text-sm font-semibold text-slate-900">{t("addProduct.field.prime")}</span>
            </label>
          </div>

          <div className="grid gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold text-slate-900">{t("addProduct.image")}</span>
              <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    setImageMode("url");
                    setImageError("");
                  }}
                  className={`px-3 py-2 text-sm font-semibold ${
                    imageMode === "url" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {t("addProduct.image.url")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageMode("upload");
                    setImageError("");
                  }}
                  className={`px-3 py-2 text-sm font-semibold ${
                    imageMode === "upload" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {t("addProduct.image.upload")}
                </button>
              </div>
            </div>

            {imageMode === "url" ? (
              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-700">{t("addProduct.imageUrl")}</span>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 outline-none ring-indigo-500/30 focus:ring"
                  placeholder="https://…"
                />
              </label>
            ) : (
              <div className="grid gap-2">
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-slate-700">{t("addProduct.uploadImage")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setImageError("");

                      // Rough guardrail for localStorage.
                      if (file.size > 6_000_000) {
                        setImageError("Billedet er for stort. Vælg et billede under 6MB.");
                        setUploadedImage("");
                        return;
                      }

                      try {
                        const dataUrl = await fileToDataUrl(file);
                        if (dataUrl.length > 2_000_000) {
                          setImageError("Billedet er for stort efter komprimering. Vælg et mindre billede.");
                          setUploadedImage("");
                          return;
                        }
                        setUploadedImage(dataUrl);
                      } catch (err) {
                        setImageError(err instanceof Error ? err.message : "Kunne ikke uploade billedet.");
                        setUploadedImage("");
                      }
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <p className="text-xs text-slate-500">
                  {t("addProduct.uploadHint")}
                </p>
              </div>
            )}

            {imageError && (
              <p className="text-sm font-semibold text-rose-700" role="alert">
                {imageError}
              </p>
            )}

            {effectiveImageUrl.trim().length >= 8 && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="aspect-[4/3]">
                  <img
                    src={effectiveImageUrl}
                    alt={t("addProduct.previewAlt")}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              {t("addProduct.cancel")}
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {t("addProduct.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
