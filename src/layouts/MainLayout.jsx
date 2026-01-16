/** @format */

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./MainLayout.css";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
const location = useLocation();

  // Create a URLSearchParams instance
  const queryParams = new URLSearchParams(location.search);

  // Get the categoryName
  const categoryName = queryParams.get('categoryName');

  console.log('Category Name:', categoryName); // Logs: Electronic & Media
  
  return (
    <div className="">
      <Header />

      <main
        // style={{ minHeight: "calc(100vh - 200px)" }}
        className=" "
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
