import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PanelHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo e Nome do Sistema */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-sm text-gray-600">Brasília Imóveis</p>
            </div>
          </div>

          {/* Menu de Navegação */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/painel"
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive("/painel") && !isActive("/painel/financiamento") && !isActive("/painel/seguro") && !isActive("/painel/imovel") && !isActive("/painel/adicionar-imovel") && !router.pathname.startsWith("/painel/editar-imovel")
                  ? "bg-red-100 text-red-700"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/painel/financiamento"
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive("/painel/financiamento")
                  ? "bg-red-100 text-red-700"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              Financiamento
            </Link>
            <Link
              href="/painel/seguro"
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive("/painel/seguro")
                  ? "bg-red-100 text-red-700"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              Seguro
            </Link>
            <Link
              href="/painel/imovel"
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive("/painel/imovel")
                  ? "bg-red-100 text-red-700"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              Imóvel
            </Link>
          </nav>

          {/* Área do Usuário */}
          <div className="flex items-center space-x-4">
            <div className="relative" style={{ zIndex: 1000 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="hidden lg:block text-sm">
                  {user?.user_metadata?.name || user?.email}
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
                    {user?.user_metadata?.name || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  href="/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Voltar ao Site
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
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden mt-4">
          <nav className="flex space-x-4 overflow-x-auto">
            <Link
              href="/painel"
              className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                isActive("/painel") && !isActive("/painel/financiamento") && !isActive("/painel/seguro") && !isActive("/painel/imovel") && !isActive("/painel/adicionar-imovel") && !router.pathname.startsWith("/painel/editar-imovel")
                  ? "bg-red-100 text-red-700"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/painel/financiamento"
              className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                isActive("/painel/financiamento")
                  ? "bg-red-100 text-red-700"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              Financiamento
            </Link>
            <Link
              href="/painel/seguro"
              className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                isActive("/painel/seguro")
                  ? "bg-red-100 text-red-700"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              Seguro
            </Link>
            <Link
              href="/painel/imovel"
              className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                isActive("/painel/imovel")
                  ? "bg-red-100 text-red-700"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              Imóvel
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
