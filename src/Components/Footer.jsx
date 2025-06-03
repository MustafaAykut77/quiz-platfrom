const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full bg-linear-30 from-[var(--background)] to-[var(--secondary-bg)] text-[var(--text)] py-3">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Tüm Hakları Saklıdır.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:scale-105 transition-all duration-200">Hakkımızda</a>
          <a href="#" className="hover:scale-105 transition-all duration-200">İletişim</a>
          <a href="#" className="hover:scale-105 transition-all duration-200">Gizlilik</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;