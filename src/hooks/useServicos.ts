
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Servico = Tables<"servicos">
type ServicoInsert = TablesInsert<"servicos">
type ServicoUpdate = TablesUpdate<"servicos">

export const useServicos = () => {
  return useQuery({
    queryKey: ["servicos"],
    queryFn: async (): Promise<Servico[]> => {
      const { data, error } = await supabase
        .from("servicos")
        .select("*")
        .order("nome")

      if (error) throw error
      return data
    },
  })
}

export const useCreateServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (servico: ServicoInsert) => {
      const { data, error } = await supabase
        .from("servicos")
        .insert(servico)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicos"] })
      toast.success("Serviço cadastrado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao cadastrar serviço:", error)
      toast.error("Erro ao cadastrar serviço")
    },
  })
}

export const useUpdateServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: ServicoUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("servicos")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicos"] })
      toast.success("Serviço atualizado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar serviço:", error)
      toast.error("Erro ao atualizar serviço")
    },
  })
}

export const useDeleteServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("servicos")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicos"] })
      toast.success("Serviço excluído com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir serviço:", error)
      toast.error("Erro ao excluir serviço")
    },
  })
}
