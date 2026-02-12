import { Link } from "react-router-dom";
import { useT } from "../features/i18n/hooks/useT";

const Footer = () => {
  const { t } = useT();

  return (
    <footer className="bg-blue-600 text-white p-6 mt-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <div className="mb-4">
          <p className="text-xl font-bold">{t("footer.brand")}</p>
          <p>{t("footer.rights")}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <Link to="/about" className="hover:text-gray-200">{t("footer.link.about")}</Link>
          <Link to="/products" className="hover:text-gray-200">{t("footer.link.products")}</Link>
          <Link to="/favorites" className="hover:text-gray-200">{t("footer.link.favorites")}</Link>
          <Link to="/cart" className="hover:text-gray-200">{t("footer.link.cart")}</Link>
        </div>
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://facebook.com/amazirian" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-6 h-6" />
          </a>
          <a href="https://x.com/amazirian" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/Twitter_Logo_2021.svg" alt="X" className="w-6 h-6" />
          </a>
          <a href="https://instagram.com/amazirian" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" alt="Instagram" className="w-6 h-6" />
          </a>
        </div>
        <div>
          <div className="mx-auto inline-flex max-w-md overflow-hidden rounded-xl bg-white shadow-sm">
            <input
              type="email"
              placeholder={t("footer.newsletterPlaceholder")}
              className="w-64 px-4 py-2 text-slate-900 outline-none"
            />
            <button type="button" className="bg-white/90 text-blue-700 px-4 py-2 font-semibold hover:bg-white">
              {t("footer.subscribe")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;