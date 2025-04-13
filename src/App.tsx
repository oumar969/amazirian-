import React, { useState } from "react";
import ProductCard from "./components/produkter"; // Importer produktkortet
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

  return (
    <>
      {/* Header (Navigation) */}
      <header className="bg-blue-600 text-white p-4">
        <nav className="flex justify-between items-center">
          <span className="text-2xl font-bold">Amazirian</span>
          <div className="space-x-4">
            <span>Hjem</span>
            <span>Butik</span>
            <span>Opret Vare</span>
            <span>Min Konto</span>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="p-6">
        <h1 className="text-4xl font-semibold text-center mb-8">Velkommen til Amazirian</h1>
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
      </main>

      {/* Interaktiv knap (count functionality) */}
      <div className="card p-6 text-center">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
