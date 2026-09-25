import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <div className="hidden w-64 shrink-0 lg:block">
          <Sidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setMenuOpen(true)} />
          <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
