import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"
import { useAtualizarEstoquePecas, useDevolverEstoquePecas } from "./useEstoquePecas"

type OrdemServico = Tables<"ordem_servico">
type OrdemServicoInsert = TablesInsert<"ordem_servico">
type OrdemServicoUpdate = TablesUpdate<"ordem_servico">

export interface OrdemServicoWithDetails extends OrdemServico {
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

export const useOrdensServico = () => {
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

export const useUpdateOrdemServico = () => {
  const queryClient = useQueryClient()
  const atualizarEstoquePecas = useAtualizarEstoquePecas()
  const devolverEstoquePecas = useDevolverEstoquePecas()

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

      // Verificar mudanças de status para controle de estoque
      const statusAntesFinalizacao = ["Andamento", "Aguardando Peças"]
      const statusFinalizacao = ["Finalizado", "Entregue"]
      
      const statusAnterior = osAtual.status_servico
      const novoStatus = updates.status_servico

      if (novoStatus && osAtual.orcamento?.orcamento_pecas && osAtual.orcamento.orcamento_pecas.length > 0) {
        const pecasParaProcessar = osAtual.orcamento.orcamento_pecas.map(op => ({
          pecaId: op.peca_id,
          quantidadeUtilizada: op.quantidade
        }))

        // Se mudou de status antes da finalização para finalizado/entregue
        if (statusAntesFinalizacao.includes(statusAnterior) && statusFinalizacao.includes(novoStatus)) {
          await atualizarEstoquePecas.mutateAsync(pecasParaProcessar)
        }
        
        // Se mudou de finalizado/entregue para status antes da finalização
        if (statusFinalizacao.includes(statusAnterior) && statusAntesFinalizacao.includes(novoStatus)) {
          await devolverEstoquePecas.mutateAsync(pecasParaProcessar)
        }
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
