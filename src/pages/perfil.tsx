import { Geist } from "next/font/google";
import { useState } from "react";
import Button from "@/components/Button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const geist = Geist({
  subsets: ["latin"],
});

export default function Perfil() {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className={`${geist.className} min-h-screen bg-gray-50 pt-24`}>
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Meu Perfil
                </h1>
                <p className="text-gray-600">
                  Gerencie suas informações pessoais
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-black">
                    {user?.user_metadata?.name || "Não informado"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-black">
                    {user?.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID do Usuário
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-black">
                    {user?.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Criação
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-black">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "Não disponível"
                    }
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Último Login
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-black">
                    {user?.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "Não disponível"
                    }
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full"
                    variant="secondary"
                  >
                    {isSigningOut ? "Saindo..." : "Sair da Conta"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
