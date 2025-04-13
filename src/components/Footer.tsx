
const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white p-6 mt-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <div className="mb-4">
          <p className="text-xl font-bold">Amazirian</p>
          <p>&copy; 2025 Amazirian. Alle rettigheder forbeholdes.</p>
        </div>
        <div className="flex justify-center space-x-6 mb-4">
          <a href="/om-os" className="hover:text-gray-300">Om os</a>
          <a href="/kontakt" className="hover:text-gray-300">Kontakt</a>
          <a href="/faq" className="hover:text-gray-300">FAQ</a>
          <a href="/betingelser" className="hover:text-gray-300">Handelsbetingelser</a>
        </div>
        <div className="flex justify-center space-x-6 mb-4">
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
          <input type="email" placeholder="Tilmeld dig nyhedsbrev" className="px-4 py-2 rounded-l-lg" />
          <button className="bg-white text-blue-600 px-4 py-2 rounded-r-lg">Tilmeld</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;