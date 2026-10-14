import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="site-wrapper d-flex flex-column min-vh-100 bg-page">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Page Viewport without awkward side margins */}
      <main className="flex-grow-1 py-4 px-3 px-md-4">
        <Outlet />
      </main>

      {/* Clean Professional Footer */}
      <footer className="bg-white border-top py-3 mt-auto">
        <div className="container-xl d-flex flex-column flex-sm-row align-items-center justify-content-between text-muted small gap-2">
          <div>
            <strong className="text-dark">SkillGap-to-Action</strong> &bull; Technical Career Diagnostic & Micro-Learning Platform
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Industry Benchmark: 70%+</span>
            <span className="text-secondary">&bull;</span>
            <span>Dedicated Internship Track Available</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
