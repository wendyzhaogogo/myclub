import React from 'react';
import Navbar from '../Navbar';

interface NavbarLayoutProps {
  children: React.ReactNode;
}

const NavbarLayout: React.FC<NavbarLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default NavbarLayout; 