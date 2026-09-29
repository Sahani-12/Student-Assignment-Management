import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-indigo-600 selection:text-white">
      {/* Subtle ambient background glow */}
      <div className="fixed inset-0 bg-dot-pattern pointer-events-none opacity-40 z-0" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sticky Desktop Sidebar */}
        <div className="hidden w-64 shrink-0 lg:block lg:sticky lg:top-0 lg:h-screen">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setMenuOpen(true)} />
          <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
