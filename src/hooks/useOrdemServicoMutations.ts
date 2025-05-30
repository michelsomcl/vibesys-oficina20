
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"
import { useOrdemServicoStockManager } from "./useOrdemServicoStock"

type OrdemServicoInsert = TablesInsert<"ordem_servico">
type OrdemServicoUpdate = TablesUpdate<"ordem_servico">

export const useUpdateOrdemServico = () => {
  const queryClient = useQueryClient()
  const { processarEstoque } = useOrdemServicoStockManager()

  return useMutation({
    mutationFn: async ({ id, ...updates }: OrdemServicoUpdate & { id: string }) => {
      // Buscar a OS atual para verificar o status anterior
      const { data: osAtual, error: osError } = await supabase
        .from("ordem_servico")
        .select(`
          *,
          orcamento:orcamentos(
            orcamento_pecas(
              quantidade,
              peca_id
            )
          )
        `)
        .eq("id", id)
        .single()

      if (osError) throw osError

      // Atualizar a OS
      const { data, error } = await supabase
        .from("ordem_servico")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Processar estoque se houve mudança de status
      if (updates.status_servico) {
        await processarEstoque(osAtual, osAtual.status_servico, updates.status_servico)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] })
      toast.success("Ordem de serviço atualizada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar ordem de serviço:", error)
      toast.error("Erro ao atualizar ordem de serviço")
    },
  })
}

export const useCreateOrdemServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ordemServico: OrdemServicoInsert) => {
      const { data: newOS, error } = await supabase
        .from("ordem_servico")
        .insert(ordemServico)
        .select()
        .single()

      if (error) throw error
      return newOS
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] })
      toast.success("Ordem de serviço criada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao criar ordem de serviço:", error)
      toast.error("Erro ao criar ordem de serviço")
    },
  })
}

export const useDeleteOrdemServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Primeiro, buscar a OS para obter o orcamento_id
      const { data: os, error: osError } = await supabase
        .from("ordem_servico")
        .select("orcamento_id")
        .eq("id", id)
        .single()

      if (osError) throw osError

      // Excluir a ordem de serviço
      const { error: deleteError } = await supabase
        .from("ordem_servico")
        .delete()
        .eq("id", id)

      if (deleteError) throw deleteError

      // Se existe um orçamento vinculado, atualizar seu status para "Pendente"
      if (os.orcamento_id) {
        const { error: updateError } = await supabase
          .from("orcamentos")
          .update({ status: "Pendente" })
          .eq("id", os.orcamento_id)

        if (updateError) throw updateError
      }

      return { deletedId: id, orcamentoId: os.orcamento_id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] })
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] })
      toast.success("Ordem de serviço excluída com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir ordem de serviço:", error)
      toast.error("Erro ao excluir ordem de serviço")
    },
  })
}
