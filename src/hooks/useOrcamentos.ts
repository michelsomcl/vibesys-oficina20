
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Orcamento = Tables<"orcamentos">
type OrcamentoInsert = TablesInsert<"orcamentos">
type OrcamentoUpdate = TablesUpdate<"orcamentos">

export interface OrcamentoWithDetails extends Orcamento {
  cliente?: Tables<"clientes">
  veiculo?: Tables<"veiculos">
  orcamento_pecas?: (Tables<"orcamento_pecas"> & {
    peca: Tables<"pecas">
  })[]
  orcamento_servicos?: (Tables<"orcamento_servicos"> & {
    servico: Tables<"servicos">
  })[]
}

export const useOrcamentos = () => {
  return useQuery({
    queryKey: ["orcamentos"],
    queryFn: async (): Promise<OrcamentoWithDetails[]> => {
      const { data: orcamentos, error } = await supabase
        .from("orcamentos")
        .select(`
          *,
          cliente:clientes(*),
          veiculo:veiculos(*),
          orcamento_pecas(
            *,
            peca:pecas(*)
          ),
          orcamento_servicos(
            *,
            servico:servicos(*)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return orcamentos || []
    },
  })
}

export const useCreateOrcamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orcamento: OrcamentoInsert) => {
      console.log("Criando novo orçamento:", orcamento)
      
      const { data: newOrcamento, error } = await supabase
        .from("orcamentos")
        .insert(orcamento)
        .select()
        .single()

      if (error) {
        console.error("Erro ao criar orçamento:", error)
        throw error
      }
      
      console.log("Orçamento criado:", newOrcamento)
      return newOrcamento
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] })
      toast.success("Orçamento criado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao criar orçamento:", error)
      toast.error("Erro ao criar orçamento")
    },
  })
}

export const useUpdateOrcamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: OrcamentoUpdate & { id: string }) => {
      console.log("Atualizando orçamento:", id, updates)
      
      // Primeiro, buscar o status atual do orçamento
      const { data: currentOrcamento, error: fetchError } = await supabase
        .from("orcamentos")
        .select("status")
        .eq("id", id)
        .single()

      if (fetchError) throw fetchError

      const currentStatus = currentOrcamento.status
      const newStatus = updates.status

      // Atualizar o orçamento
      const { data, error } = await supabase
        .from("orcamentos")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Se o status mudou de "Aprovado" para outro status, excluir a OS vinculada
      if (currentStatus === "Aprovado" && newStatus && newStatus !== "Aprovado") {
        console.log("Status mudou de Aprovado para", newStatus, "- Excluindo OS vinculada")
        
        const { error: deleteOSError } = await supabase
          .from("ordem_servico")
          .delete()
          .eq("orcamento_id", id)

        if (deleteOSError) {
          console.error("Erro ao excluir OS:", deleteOSError)
          // Não falha a operação principal, apenas loga o erro
        } else {
          console.log("OS excluída com sucesso")
        }
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] })
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] })
      toast.success("Orçamento atualizado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar orçamento:", error)
      toast.error("Erro ao atualizar orçamento")
    },
  })
}

export const useDeleteOrcamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("orcamentos")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] })
      toast.success("Orçamento excluído com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir orçamento:", error)
      toast.error("Erro ao excluir orçamento")
    },
  })
}
