
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"

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

export const useOrdensServicoQueries = () => {
  return useQuery({
    queryKey: ["ordens_servico"],
    queryFn: async (): Promise<OrdemServicoWithDetails[]> => {
      const { data: ordensServico, error } = await supabase
        .from("ordem_servico")
        .select(`
          *,
          cliente:clientes(*),
          veiculo:veiculos(*),
          orcamento:orcamentos(
            *,
            orcamento_pecas(
              *,
              peca:pecas(*)
            ),
            orcamento_servicos(
              *,
              servico:servicos(*)
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Para cada OS, buscar o veículo do cliente se não houver veículo específico
      const ordensComVeiculos = await Promise.all(
        (ordensServico || []).map(async (os) => {
          if (!os.veiculo && os.cliente_id) {
            // Buscar o primeiro veículo do cliente
            const { data: clienteVeiculos } = await supabase
              .from("veiculos")
              .select("*")
              .eq("cliente_id", os.cliente_id)
              .limit(1)

            if (clienteVeiculos && clienteVeiculos.length > 0) {
              return {
                ...os,
                cliente_veiculo: clienteVeiculos[0]
              }
            }
          }
          return os
        })
      )

      return ordensComVeiculos || []
    },
  })
}
