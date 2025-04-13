import React, { useState } from "react";
import ProductCard from "../components/ProductCard";

type Product = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      title: "Smartphone",
      description: "En fantastisk smartphone med stor skærm.",
      price: "2500",
      imageUrl: "data:image/jpeg;base64,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",
      category: "Elektronik",
    },
    {
      title: "T-shirt",
      description: "Bomulds T-shirt med fedt design.",
      price: "300",
      imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQTJh2R5ZLqc_sVtYudmn-dLyYK9jZg2xGgqWOA-pTlXrToMK8h5NsLuuA6ZvzeKDUaPXxMfAxrcAi1HQyJHBVZnQXwNSFIZoubZWrwlAmywLc_CnTZBAxdzy0wi5qDTxQ84OkBbWQ&usqp=CAc",
      category: "Tøj",
    },
    {
      title: "Bog",
      description: "Spændende roman af en syrisk forfatter.",
      price: "150",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Syria_%282025-%29.svg",
      category: "Bøger",
    },
  ]);

  const [filter, setFilter] = useState("Alle");

  const [newProduct, setNewProduct] = useState<Product>({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });

  const handleAddProduct = () => {
    if (
      newProduct.title &&
      newProduct.description &&
      newProduct.price &&
      newProduct.imageUrl &&
      newProduct.category
    ) {
      setProducts([...products, newProduct]);
      setNewProduct({ title: "", description: "", price: "", imageUrl: "", category: "" });
    }
  };

  const categories = ["Alle", "Elektronik", "Tøj", "Bøger"];

  const filteredProducts = filter === "Alle"
    ? products
    : products.filter((p) => p.category === filter);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Vores Produkter</h2>

      {/* Filter med radioknapper */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Filtrér efter kategori:</label>
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-2">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filter === cat}
                onChange={(e) => setFilter(e.target.value)}
                className="form-radio"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tilføj nyt produkt */}
      <div className="mb-6 bg-gray-100 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Tilføj nyt produkt</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <input
            className="border p-2 rounded"
            placeholder="Titel"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Beskrivelse"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Pris"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Billede URL"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Kategori"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddProduct}
          >
            Tilføj
          </button>
        </div>
      </div>

       {/* Produkter visning */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
               <ProductCard
        key={index}
        title={product.title}
        description={product.description}
        price={product.price}
        imageUrl={product.imageUrl}
        category={product.category}
      />
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-blue-600 font-bold text-lg">{product.price} DKK</p>
                <p className="text-sm text-gray-500 italic">{product.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
  
      </div>
  );
};

export default Products;