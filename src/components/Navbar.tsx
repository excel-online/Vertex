import { useState } from 'react';
import LanguageSelector from './LanguageSelector';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#090D16]/90 backdrop-blur-md border-b border-[#c5a059]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-[#c5a059] font-bold text-lg sm:text-xl tracking-wider">VELLUMTRADE</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <a href="#features" className="hover:text-[#c5a059] transition">Features</a>
          <a href="#pricing" className="hover:text-[#c5a059] transition">Pricing</a>
          <a href="#testimonials" className="hover:text-[#c5a059] transition">Testimonials</a>
        </nav>

        {/* Actions: Language Selector & Auth */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          
          <a
            href="#login"
            className="hidden sm:inline-block text-sm font-medium text-gray-300 hover:text-[#c5a059] px-3 py-1.5 transition"
          >
            Login
          </a>
          
          <a
            href="#get-started"
            className="bg-[#c5a059] text-[#090D16] font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-[#d4af37] transition shadow-md"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
