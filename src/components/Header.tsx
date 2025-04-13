// src/components/Header.tsx
//import { useState } from "react";
import { Link } from "react-router-dom"; 

const Header: React.FC = () => {
 // const [isLoggedIn, setIsLoggedIn] = useState(false);
  /*const [messageCount, setMessageCount] = useState(5); // Demoformål

  const handleLoginClick = () => {
    setIsLoggedIn(!isLoggedIn);
  };*/

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Amazirian</h1>
        <nav className="ml-6 space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/products" className="hover:text-gray-300">Products</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
        </nav>
      </div>

      <div className="flex items-center space-x-6">
      
      </div>
    </header>
  );
};

export default Header;
