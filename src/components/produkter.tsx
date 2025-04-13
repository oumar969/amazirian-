// src/components/ProductCard.tsx
import React from "react";

type ProductCardProps = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ title, description, price, imageUrl }) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="mt-2 text-lg font-bold">{price} SYP</p>
        <button className="w-full mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">Køb</button>
      </div>
    </div>
  );
};

export default ProductCard;
