
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"

type Veiculo = Tables<"veiculos">

export const useVeiculos = () => {
  return useQuery({
    queryKey: ["veiculos"],
    queryFn: async (): Promise<Veiculo[]> => {
      const { data: veiculos, error } = await supabase
        .from("veiculos")
        .select("*")
        .order("marca")

      if (error) throw error
      return veiculos || []
    },
  })
}

export const useVeiculosByCliente = (clienteId?: string) => {
  return useQuery({
    queryKey: ["veiculos", "cliente", clienteId],
    queryFn: async (): Promise<Veiculo[]> => {
      if (!clienteId) return []
      
      const { data: veiculos, error } = await supabase
        .from("veiculos")
        .select("*")
        .eq("cliente_id", clienteId)
        .order("marca")

      if (error) throw error
      return veiculos || []
    },
    enabled: !!clienteId,
  })
}
