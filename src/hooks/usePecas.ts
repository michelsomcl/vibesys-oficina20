
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Peca = Tables<"pecas">
type PecaInsert = TablesInsert<"pecas">
type PecaUpdate = TablesUpdate<"pecas">

export const usePecas = () => {
  return useQuery({
    queryKey: ["pecas"],
    queryFn: async (): Promise<Peca[]> => {
      const { data, error } = await supabase
        .from("pecas")
        .select("*")
        .order("nome")

      if (error) throw error
      return data
    },
  })
}

export const useCreatePeca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (peca: PecaInsert) => {
      const { data, error } = await supabase
        .from("pecas")
        .insert(peca)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas"] })
      toast.success("Peça cadastrada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao cadastrar peça:", error)
      toast.error("Erro ao cadastrar peça")
    },
  })
}

export const useUpdatePeca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: PecaUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("pecas")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas"] })
      toast.success("Peça atualizada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar peça:", error)
      toast.error("Erro ao atualizar peça")
    },
  })
}

export const useDeletePeca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pecas")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas"] })
      toast.success("Peça excluída com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir peça:", error)
      toast.error("Erro ao excluir peça")
    },
  })
}
