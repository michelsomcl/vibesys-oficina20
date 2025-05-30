
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface AtualizarEstoqueParams {
  pecaId: string
  quantidadeUtilizada: number
}

export const useAtualizarEstoquePecas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: AtualizarEstoqueParams[]) => {
      // Para cada peça, atualizar o estoque
      for (const { pecaId, quantidadeUtilizada } of params) {
        // Primeiro, buscar o estoque atual
        const { data: peca, error: pecaError } = await supabase
          .from("pecas")
          .select("estoque")
          .eq("id", pecaId)
          .single()

        if (pecaError) throw pecaError

        const estoqueAtual = peca.estoque || 0
        const novoEstoque = Math.max(0, estoqueAtual - quantidadeUtilizada)

        // Atualizar o estoque
        const { error: updateError } = await supabase
          .from("pecas")
          .update({ estoque: novoEstoque })
          .eq("id", pecaId)

        if (updateError) throw updateError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas"] })
      toast.success("Estoque das peças atualizado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar estoque das peças:", error)
      toast.error("Erro ao atualizar estoque das peças")
    },
  })
}
