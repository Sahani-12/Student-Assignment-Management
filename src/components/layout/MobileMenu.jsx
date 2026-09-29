import { X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        aria-label="Close menu backdrop"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-[min(85vw,320px)] flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-4 z-20 rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition shadow-xs"
          aria-label="Close sidebar navigation"
        >
          <X className="h-5 w-5" />
        </button>

        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  );
}

