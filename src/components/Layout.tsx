
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./NavBar";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
