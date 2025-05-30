
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type OrcamentoPeca = Tables<"orcamento_pecas">
type OrcamentoPecaInsert = TablesInsert<"orcamento_pecas">
type OrcamentoPecaUpdate = TablesUpdate<"orcamento_pecas">

export const useOrcamentoPecas = (orcamentoId?: string) => {
  return useQuery({
    queryKey: ["orcamento_pecas", orcamentoId],
    queryFn: async (): Promise<(OrcamentoPeca & { peca: Tables<"pecas"> })[]> => {
      if (!orcamentoId) return []
      
      const { data, error } = await supabase
        .from("orcamento_pecas")
        .select(`
          *,
          peca:pecas(*)
        `)
        .eq("orcamento_id", orcamentoId)

      if (error) throw error
      return data || []
    },
    enabled: !!orcamentoId,
  })
}

export const useCreateOrcamentoPeca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: OrcamentoPecaInsert) => {
      const { data: result, error } = await supabase
        .from("orcamento_pecas")
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orcamento_pecas", variables.orcamento_id] })
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] })
      toast.success("Peça adicionada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao adicionar peça:", error)
      toast.error("Erro ao adicionar peça")
    },
  })
}

export const useDeleteOrcamentoPeca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, orcamentoId }: { id: string, orcamentoId: string }) => {
      const { error } = await supabase
        .from("orcamento_pecas")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orcamento_pecas", variables.orcamentoId] })
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] })
      toast.success("Peça removida com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao remover peça:", error)
      toast.error("Erro ao remover peça")
    },
  })
}
