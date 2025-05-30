
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Funcionario = Tables<"funcionarios">
type FuncionarioInsert = TablesInsert<"funcionarios">
type FuncionarioUpdate = TablesUpdate<"funcionarios">

export const useFuncionarios = () => {
  return useQuery({
    queryKey: ["funcionarios"],
    queryFn: async (): Promise<Funcionario[]> => {
      const { data, error } = await supabase
        .from("funcionarios")
        .select("*")
        .order("nome")

      if (error) throw error
      return data
    },
  })
}

export const useCreateFuncionario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (funcionario: FuncionarioInsert) => {
      const { data, error } = await supabase
        .from("funcionarios")
        .insert(funcionario)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] })
      toast.success("Funcionário cadastrado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao cadastrar funcionário:", error)
      toast.error("Erro ao cadastrar funcionário")
    },
  })
}

export const useUpdateFuncionario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: FuncionarioUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("funcionarios")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] })
      toast.success("Funcionário atualizado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar funcionário:", error)
      toast.error("Erro ao atualizar funcionário")
    },
  })
}

export const useDeleteFuncionario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("funcionarios")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] })
      toast.success("Funcionário excluído com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir funcionário:", error)
      toast.error("Erro ao excluir funcionário")
    },
  })
}
