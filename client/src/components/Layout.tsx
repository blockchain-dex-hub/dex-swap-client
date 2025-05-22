import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      <main className="flex-grow py-6 md:py-10">
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
