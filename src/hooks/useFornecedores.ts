
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Fornecedor = Tables<"fornecedores">
type FornecedorInsert = TablesInsert<"fornecedores">
type FornecedorUpdate = TablesUpdate<"fornecedores">

export const useFornecedores = () => {
  return useQuery({
    queryKey: ["fornecedores"],
    queryFn: async (): Promise<Fornecedor[]> => {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("nome")

      if (error) throw error
      return data
    },
  })
}

export const useCreateFornecedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (fornecedor: FornecedorInsert) => {
      const { data, error } = await supabase
        .from("fornecedores")
        .insert(fornecedor)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
      toast.success("Fornecedor cadastrado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao cadastrar fornecedor:", error)
      toast.error("Erro ao cadastrar fornecedor")
    },
  })
}

export const useUpdateFornecedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: FornecedorUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("fornecedores")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
      toast.success("Fornecedor atualizado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar fornecedor:", error)
      toast.error("Erro ao atualizar fornecedor")
    },
  })
}

export const useDeleteFornecedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
      toast.success("Fornecedor excluído com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir fornecedor:", error)
      toast.error("Erro ao excluir fornecedor")
    },
  })
}
