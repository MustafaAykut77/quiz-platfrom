import Header from "./Header";
import Footer from "./Footer";

// Layout component with sidebar
const Layout = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col">   
      <Header />
      
      <main className="flex-1 mt-14">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;