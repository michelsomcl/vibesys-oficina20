
import { Tables } from "@/integrations/supabase/types"

// Re-export the interface for backward compatibility
export interface OrdemServicoWithDetails extends Tables<"ordem_servico"> {
  cliente?: Tables<"clientes">
  veiculo?: Tables<"veiculos">
  cliente_veiculo?: Tables<"veiculos">
  orcamento?: Tables<"orcamentos"> & {
    orcamento_pecas?: (Tables<"orcamento_pecas"> & {
      peca: Tables<"pecas">
    })[]
    orcamento_servicos?: (Tables<"orcamento_servicos"> & {
      servico: Tables<"servicos">
    })[]
  }
}

// Re-export all hooks for backward compatibility
export { useOrdensServicoQueries as useOrdensServico } from "./useOrdemServicoQueries"
export { 
  useUpdateOrdemServico, 
  useCreateOrdemServico, 
  useDeleteOrdemServico 
} from "./useOrdemServicoMutations"
