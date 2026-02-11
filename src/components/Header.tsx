// src/components/Header.tsx
//import { useState } from "react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";
import { useCart } from "../features/cart/hooks/useCart";

import amazirianLogo from "../assets/amazirian-logo.svg";

const REMOTE_LOGO_URL =
  "https://lh3.googleusercontent.com/rd-gg-dl/AOI_d_-HKuqT-Mhnpx1ILAFiikh5Zjxl1lW4-mYL0qEjJ75ZFX2pCShVK0MDWQ1rr1jYiNy9_0AxBXMZ55M1JjxrX0tVpQGFeBu4btlDUpBXZo23vch0knnd-5qoCDV0r4PzRh7JF6lxetkBcLsRJH8rXpuMNQvr9hGaRjvEIIQ0fBB9Vy5NuXdg2K5ARlWu6HQjTdayivyQYGlGjXeVA3Zmy9Tk8r7t-7PzD3HroMZYT2C8H5m8JRulZU_8yvJVorxzv2LFScbHx5MnvRixHPF27hEUB-U31AONAnr395t7sIsrCehXhNy7_tO1T0MrEP1PKZrDEqi6EoCO9l93ds-hrnzVB00voeXoe4JdLNl_wuQD5R6SHE62KA1nlUuF7iiVaWALGrElP7Jov8ocTh0qMTbVmzYmxxyuU36JEztewVROBlVyqXp88qOeaPQf8-B3hRObmuvxeV44sREA8c1kkgMs2dW9P9cQOqsinKGQTXMAtA_qdYno5JdVCJGE7oeu4XzJ9MpB9ZwS9tsoljfuzg_zZBpeA8kU9syaHnlYe9rirzmDEYtlU7QT684dx9aDHwhZ0CM31XTlPYbmt6EIZvTj9ia4M-Xy1uC4kX3D_neXQqYjX9YSiBg2_fwLScOryNnEzlXM6L2MfC-5Rjrp6zOshS1AQCKjGQjESjqdgSQB8bm47ofB4Dn0yLFykFiFVxAzX-QedgbtmNPfGdc-bW_nCYw25yb6z5pVuqAqHxwuhCRuNFq765D76w1FHDbACbKi8vohdEo63bIiySqLcBXlojxPTrQEzARE-x4WjDgGZWP9od1h1T-X0Do9cpAs8OGccnUaJcY9_-O5vv-NyPbxbpXLhle7ETGl0unp_qe1o2UyImc6wlH1GnmwcB1AoKLxf0mL3Pmg1SIFLC2aq6zR054JLwfNCCmM4eGvYUgfemD_if_FM7mbAPFzk7XhbLNEEgXZjQG3YsovVfIzihG13clWMNnA6JIezIAuPOJYxMV9ZAkRvY6QBA3QQvYSZXnqa6oKU4maJ5DnP_gKqwyriDbPL0cQy5oTSwcTeInXkUfpALLqRU2K9U43H22pLCmtZ4PF6qSg92w7UMGgj3iWO2EmA-yZvOrYPSCtg-MppYYBBxGf755qqs4j2zWk6uIydd7zOT-Xr7P_FoHvkXTgglr7aas6izxowLByDw1rcrCS_l8avA=s1024-rj";

const CATEGORY_ALL = "Alle" as const;
const CATEGORY_VALUES = [
  CATEGORY_ALL,
  "Elektronik",
  "Tøj",
  "Bøger",
  "Hjem",
  "Skønhed",
  "Legetøj",
  "Sport",
  "Andet",
] as const;

type HeaderCategory = (typeof CATEGORY_VALUES)[number];

function buildProductsSearch(query: string, category: HeaderCategory) {
  const params = new URLSearchParams();
  const q = query.trim();
  if (q) params.set("q", q);
  if (category !== CATEGORY_ALL) params.set("cat", category);
  const search = params.toString();
  return search ? `?${search}` : "";
}

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState<HeaderCategory>(CATEGORY_ALL);
  const [query, setQuery] = useState<string>("");
  const [useRemoteLogo, setUseRemoteLogo] = useState(true);

  useEffect(() => {
    if (!location.pathname.startsWith("/products")) return;

    const params = new URLSearchParams(location.search);
    const q = params.get("q") ?? "";
    const cat = (params.get("cat") ?? CATEGORY_ALL) as HeaderCategory;

    setQuery(q);
    setCategory(CATEGORY_VALUES.includes(cat) ? cat : CATEGORY_ALL);
  }, [location.pathname, location.search]);

  const categoryLinks = useMemo(() => {
    return CATEGORY_VALUES.filter((c) => c !== CATEGORY_ALL);
  }, []);
 // const [isLoggedIn, setIsLoggedIn] = useState(false);
  /*const [messageCount, setMessageCount] = useState(5); // Demoformål

  const handleLoginClick = () => {
    setIsLoggedIn(!isLoggedIn);
  };*/

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigate(`/products${buildProductsSearch(query, category)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900 text-white">
      {/* Top row */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link
          to="/"
          className="shrink-0 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5 hover:bg-slate-50"
          aria-label="Gå til forsiden"
        >
          <img
            src={useRemoteLogo ? REMOTE_LOGO_URL : amazirianLogo}
            alt="Amazirian Online Marketplace"
            className="h-9 w-auto"
            loading="eager"
            referrerPolicy="no-referrer"
            onError={() => setUseRemoteLogo(false)}
          />
        </Link>

        <form onSubmit={onSubmit} className="flex min-w-0 flex-1 items-center">
          <div className="flex w-full overflow-hidden rounded-2xl bg-white">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as HeaderCategory)}
              className="hidden max-w-[170px] shrink-0 border-r border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-900 outline-none sm:block"
              aria-label="Kategori"
            >
              {CATEGORY_VALUES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søg i Amazirian…"
              className="min-w-0 flex-1 px-4 py-3 text-sm text-slate-900 outline-none"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center bg-emerald-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-400"
              aria-label="Søg"
              title="Søg"
            >
              ⌕
            </button>
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hidden rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10 sm:inline-flex ${
                isActive ? "bg-white/10" : ""
              }`
            }
          >
            About
          </NavLink>

          {!isAuthenticated ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10 ${isActive ? "bg-white/10" : ""}`
              }
            >
              Login
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Logout
            </button>
          )}

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
            aria-label="Kurv"
            title="Kurv"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <span className="hidden sm:inline">Kurv</span>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[11px] font-extrabold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user && (
            <div className="hidden rounded-xl px-3 py-2 text-sm text-white/80 md:block">
              Hej, <span className="font-semibold text-white">{user.displayName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Second row (categories) */}
      <div className="border-t border-slate-800 bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold hover:bg-white/10 ${
                isActive ? "bg-white/10" : ""
              }`
            }
          >
            Alle
          </NavLink>
          {categoryLinks.map((c) => (
            <Link
              key={c}
              to={`/products?cat=${encodeURIComponent(c)}`}
              className="whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
            >
              {c}
            </Link>
          ))}
          <div className="ml-auto hidden items-center gap-3 text-xs text-white/60 lg:flex">
            <span>Hurtig levering</span>
            <span>•</span>
            <span>30 dages retur</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
