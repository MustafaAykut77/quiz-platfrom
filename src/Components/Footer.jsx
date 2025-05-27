const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full bg-gray-900 text-white py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Tüm Hakları Saklıdır.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-400">Hakkımızda</a>
          <a href="#" className="hover:text-gray-400">İletişim</a>
          <a href="#" className="hover:text-gray-400">Gizlilik</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;