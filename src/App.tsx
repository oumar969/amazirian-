import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer"; // Import Footer
import Header from "./components/Header"; // Header til navigation
import Home from "./page/Home"; // Hjemmeside
import Login from "./page/Login"; // Login-side
import ProductCard from "./components/ProductCard"; // For at vise produkter
import About from "./page/About"; // Om os side
import Products from "./page/Products";


import './App.css';

function App() {
  // Sample products
  const products = [
    {
      title: "Smartphone",
      description: "En fantastisk smartphone med stor skærm.",
      price: "25000",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Syria_%282025-%29.svg",
    },
    {
      title: "Laptop",
      description: "En kraftfuld laptop til arbejde og gaming.",
      price: "45000",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Syria_%282025-%29.svg",
    },
    {
      title: "Kamera",
      description: "Et kamera med høj opløsning og professionel kvalitet.",
      price: "15000",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Syria_%282025-%29.svg",
    },
  ];

  const [count, setCount] = useState(0); // Denne kan vi beholde for eventuel interaktivitet senere
// Add a button to increase the count
return (
  <div>
    <h1>{count}</h1>
    <button onClick={() => setCount(count + 1)}>Increase Count</button>
  </div>
);
  return (
    // Tilføj basename her
    <Router basename="/amazirian-/"> 
      {/* Header (Navigation) */}
      <Header />

      {/* Main content */}
      <main className="p-6">
        <h1 className="text-4xl font-semibold text-center mb-8">Velkommen til Amazirian</h1>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sample-products" element={
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
} />
        </Routes>
      </main>

     

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
