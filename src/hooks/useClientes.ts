
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Cliente = Tables<"clientes">
type ClienteInsert = TablesInsert<"clientes">
type ClienteUpdate = TablesUpdate<"clientes">

export const useClientes = () => {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: async (): Promise<Cliente[]> => {
      const { data: clientes, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nome")

      if (error) throw error
      return clientes || []
    },
  })
}

export const useCreateCliente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (cliente: ClienteInsert) => {
      const { data: newCliente, error } = await supabase
        .from("clientes")
        .insert(cliente)
        .select()
        .single()

      if (error) throw error
      return newCliente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast.success("Cliente cadastrado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao cadastrar cliente:", error)
      toast.error("Erro ao cadastrar cliente")
    },
  })
}

export const useUpdateCliente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: ClienteUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("clientes")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast.success("Cliente atualizado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar cliente:", error)
      toast.error("Erro ao atualizar cliente")
    },
  })
}

export const useDeleteCliente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast.success("Cliente excluído com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir cliente:", error)
      toast.error("Erro ao excluir cliente")
    },
  })
}
