import Sidebar from './Sidebar';

export default function MobileMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        aria-label="Close menu backdrop"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 h-full w-[min(100%,300px)] shadow-2xl">
        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  );
}
