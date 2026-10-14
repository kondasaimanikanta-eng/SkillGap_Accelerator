import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Mobile Navbar */}
        <Navbar />

        {/* Page Content Viewport */}
        <main className="flex-grow-1 p-3 p-md-4 p-xl-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
