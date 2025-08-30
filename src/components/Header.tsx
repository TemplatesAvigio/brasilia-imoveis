import Logo from "./Logo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getWhatsAppUrl } from "@/constants/contact";

export default function Header() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const isHomePage = router.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    const handleClickOutside = () => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHomePage 
        ? isScrolled 
          ? 'bg-red-800 h-20' 
          : 'bg-transparent' 
        : 'bg-red-800 h-20'
    }`}>
      
              <div className="container mx-auto px-6 py-4 flex justify-between items-center h-full">
        {/* Logo */}
        <Logo />
        
        {/* Menu de Navegação Desktop */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/quem-somos" className="text-white hover:text-gray-300 transition-colors">Quem somos</Link>
          <a 
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Fale conosco
          </a>
          <Link href="/financiamento" className="text-white hover:text-gray-300 transition-colors">Faça seu Financiamento</Link>
          <Link href="/seguro" className="text-white hover:text-gray-300 transition-colors">Faça seu Seguro</Link>
        </nav>

        {/* Área do Usuário */}
        {user && (
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" style={{ zIndex: 1000 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-800 text-sm font-bold">
                    {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="hidden lg:block">
                  {user.user_metadata?.name || user.email}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div 
                className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 transition-all duration-200 ${
                  isUserMenuOpen 
                    ? 'opacity-100 scale-100 pointer-events-auto' 
                    : 'opacity-0 scale-95 pointer-events-none'
                }`} 
                style={{ zIndex: 9999 }}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user.user_metadata?.name || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link
                  href="/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  href="/painel"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Painel Administrativo
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Menu Mobile */}
        <div className="md:hidden">
          <button 
            className="text-white p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-red-800 shadow-lg">
          <nav className="container mx-auto px-6 py-4 space-y-4">
            <Link 
              href="/quem-somos" 
              className="block text-white hover:text-gray-300 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Quem somos
            </Link>
            <a 
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-white hover:text-gray-300 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Fale conosco
            </a>
            <Link 
              href="/financiamento" 
              className="block text-white hover:text-gray-300 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Faça seu Financiamento
            </Link>
            <Link 
              href="/seguro" 
              className="block text-white hover:text-gray-300 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Faça seu Seguro
            </Link>
            
            {/* Área do Usuário Mobile */}
            {user && (
              <div className="border-t border-red-700 pt-4 mt-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-red-800 text-sm font-bold">
                      {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="text-white text-sm">
                    {user.user_metadata?.name || user.email}
                  </span>
                </div>
                <Link 
                  href="/perfil" 
                  className="block text-white hover:text-gray-300 transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Meu Perfil
                </Link>
                <Link 
                  href="/painel" 
                  className="block text-white hover:text-gray-300 transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Painel Administrativo
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left text-white hover:text-gray-300 transition-colors py-2"
                >
                  Sair
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
