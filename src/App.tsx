import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import About from "./page/About";
import Cart from "./page/Cart";
import Checkout from "./page/Checkout";
import Home from "./page/Home";
import Login from "./page/Login";
import ProductDetails from "./page/ProductDetails";
import Products from "./page/Products";

import "./App.css";

function App() {
  const products = [
    {
      title: "Smartphone",
      description: "En fantastisk smartphone med stor skærm.",
      price: "25000",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Syria_%282025-%29.svg",
    },
    {
      title: "Laptop",
      description: "En kraftfuld laptop til arbejde og gaming.",
      price: "45000",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Syria_%282025-%29.svg",
    },
    {
      title: "Kamera",
      description: "Et kamera med høj opløsning og professionel kvalitet.",
      price: "15000",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Syria_%282025-%29.svg",
    },
  ];

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/sample-products"
              element={
                <div className="mx-auto max-w-6xl px-6 py-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                      <ProductCard
                        key={index}
                        title={product.title}
                        description={product.description}
                        price={product.price}
                        imageUrl={product.imageUrl}
                      />
                    ))}
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
