import React from "react";

type ProductCardProps = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  category?: string; // valgfri
};

const ProductCard: React.FC<ProductCardProps> = ({ title, description, price, imageUrl, category }) => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        
        {/* Viser kategori hvis den findes */}
        {category && (
          <p className="text-xs text-gray-500 italic mb-2">Kategori: {category}</p>
        )}

        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <p className="text-blue-600 font-bold text-lg">{price} SYP</p>
        <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-300">
          Køb
        </button>
      </div>
    </div>
  );
};

export default ProductCard;