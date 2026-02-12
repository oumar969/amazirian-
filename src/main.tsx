import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./features/auth/AuthContext";
import { CartProvider } from "./features/cart/CartContext";
import { I18nProvider } from "./features/i18n/I18nContext";
import { FavoritesProvider } from "./features/favorites/FavoritesContext";
import { OrdersProvider } from "./features/orders/OrdersContext";
import { AddressBookProvider } from "./features/addressBook/AddressBookContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <OrdersProvider>
          <AddressBookProvider>
            <FavoritesProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </FavoritesProvider>
          </AddressBookProvider>
        </OrdersProvider>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
)
