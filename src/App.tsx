
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import Fornecedores from "./pages/Fornecedores";
import Pecas from "./pages/Pecas";
import Servicos from "./pages/Servicos";
import Orcamentos from "./pages/Orcamentos";
import Oficina from "./pages/Oficina";
import Financeiro from "./pages/Financeiro";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/pecas" element={<Pecas />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/orcamentos" element={<Orcamentos />} />
            <Route path="/oficina" element={<Oficina />} />
            <Route path="/financeiro" element={<Financeiro />} />
            {/* Rotas em desenvolvimento */}
            <Route path="/relacionamento" element={<div className="p-8 text-center"><h1 className="text-2xl">Relacionamento - Em Desenvolvimento</h1></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
