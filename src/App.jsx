import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/common/navbar/NavBar";
import Footer from "./components/common/footer/Footer";

const App = () => {
  return (
    <>
      <NavBar />
      <main className="min-h-[90vh] flex-grow">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
