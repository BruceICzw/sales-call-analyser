
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./NavBar";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
