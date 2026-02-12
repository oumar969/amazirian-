import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { AddProductModal } from "../features/products/components/AddProductModal";
import { ProductGridCard } from "../features/products/components/ProductGridCard";
import { ProductListRow } from "../features/products/components/ProductListRow";
import type { ProductCategory } from "../features/products/models/Product";
import { type ProductsSort, useProductsViewModel } from "../features/products/viewmodels/useProductsViewModel";
import { useT } from "../features/i18n/hooks/useT";

const ALL = "Alle" as const;

export default function Products() {
  const { t } = useT();
  const vm = useProductsViewModel();
  const [searchParams] = useSearchParams();

  const { setQuery, setCategory } = vm.actions;

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const cat = searchParams.get("cat") ?? ALL;

    setQuery(q);
    if (cat === ALL) {
      setCategory(ALL);
    } else if (vm.categories.includes(cat as ProductCategory)) {
      setCategory(cat as ProductCategory);
    }
  }, [searchParams, setQuery, setCategory, vm.categories]);

  const pageNumbers = (() => {
    const total = vm.state.totalPages;
    const current = vm.state.page;
    const windowSize = 5;
    const start = Math.max(1, current - Math.floor(windowSize / 2));
    const end = Math.min(total, start + windowSize - 1);
    const actualStart = Math.max(1, end - windowSize + 1);
    const nums: number[] = [];
    for (let i = actualStart; i <= end; i++) nums.push(i);
    return nums;
  })();

  return (
    <div className="bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t("products.title")}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {t("products.subtitle", { count: vm.state.total.toLocaleString() })}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  value={vm.state.query}
                  onChange={(e) => vm.actions.setQuery(e.target.value)}
                  placeholder={t("products.searchPlaceholder")}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm outline-none ring-indigo-500/30 focus:ring sm:w-[360px]"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>
              </div>

              <button
                type="button"
                onClick={() => vm.actions.setAddOpen(true)}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {t("products.add")}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={vm.state.category}
                onChange={(e) => vm.actions.setCategory(e.target.value as ProductCategory | typeof ALL)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500/30 focus:ring"
                aria-label={t("header.category")}
              >
                <option value="Alle">{t("products.allCategories")}</option>
                {vm.categories.map((c) => (
                  <option key={c} value={c}>
                    {(() => {
                      const label = t(`category.${c}`);
                      return label === `category.${c}` ? c : label;
                    })()}
                  </option>
                ))}
              </select>

              <input
                value={vm.state.minPrice}
                onChange={(e) => vm.actions.setMinPrice(e.target.value)}
                placeholder={t("products.minPrice")}
                className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500/30 focus:ring"
              />
              <input
                value={vm.state.maxPrice}
                onChange={(e) => vm.actions.setMaxPrice(e.target.value)}
                placeholder={t("products.maxPrice")}
                className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500/30 focus:ring"
              />

              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={vm.state.onlyPrime}
                  onChange={(e) => vm.actions.setOnlyPrime(e.target.checked)}
                />
                {t("products.onlyPrime")}
              </label>

              <button
                type="button"
                onClick={vm.actions.resetCatalog}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                title="Nulstil demo-katalog"
              >
                {t("products.reset")}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={vm.state.sort}
                onChange={(e) => vm.actions.setSort(e.target.value as ProductsSort)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500/30 focus:ring"
                aria-label="Sortering"
              >
                <option value="relevance">{t("products.sort.relevance")}</option>
                <option value="newest">{t("products.sort.newest")}</option>
                <option value="rating">{t("products.sort.rating")}</option>
                <option value="price_asc">{t("products.sort.priceAsc")}</option>
                <option value="price_desc">{t("products.sort.priceDesc")}</option>
              </select>

              <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => vm.actions.setView("grid")}
                  className={`px-3 py-2 text-sm font-semibold ${
                    vm.state.view === "grid" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {t("products.view.grid")}
                </button>
                <button
                  type="button"
                  onClick={() => vm.actions.setView("list")}
                  className={`px-3 py-2 text-sm font-semibold ${
                    vm.state.view === "list" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {t("products.view.list")}
                </button>
              </div>

              <select
                value={vm.state.pageSize}
                onChange={(e) => vm.actions.setPageSize(Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500/30 focus:ring"
                aria-label="Antal per side"
              >
                <option value={12}>12 / side</option>
                <option value={24}>24 / side</option>
                <option value={48}>48 / side</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {vm.products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-600">{t("products.empty")}</p>
          </div>
        ) : vm.state.view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vm.products.map((p) => (
              <ProductGridCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {vm.products.map((p) => (
              <ProductListRow key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-slate-600">
            {t("products.page", { page: vm.state.page, totalPages: vm.state.totalPages })}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => vm.actions.setPage(Math.max(1, vm.state.page - 1))}
              disabled={vm.state.page <= 1}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
            >
              {t("products.prev")}
            </button>

            {pageNumbers[0] !== 1 && (
              <>
                <button
                  type="button"
                  onClick={() => vm.actions.setPage(1)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  1
                </button>
                <span className="px-1 text-slate-400">…</span>
              </>
            )}

            {pageNumbers.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => vm.actions.setPage(n)}
                className={`rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold ${
                  n === vm.state.page ? "bg-slate-900 text-white" : "bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                {n}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] !== vm.state.totalPages && (
              <>
                <span className="px-1 text-slate-400">…</span>
                <button
                  type="button"
                  onClick={() => vm.actions.setPage(vm.state.totalPages)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  {vm.state.totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => vm.actions.setPage(Math.min(vm.state.totalPages, vm.state.page + 1))}
              disabled={vm.state.page >= vm.state.totalPages}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
            >
              {t("products.next")}
            </button>
          </div>
        </div>
      </div>

      <AddProductModal
        open={vm.state.addOpen}
        categories={vm.categories}
        onClose={() => vm.actions.setAddOpen(false)}
        onAdd={vm.actions.addProduct}
      />
    </div>
  );
}