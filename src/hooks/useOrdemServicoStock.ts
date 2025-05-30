
import { useAtualizarEstoquePecas, useDevolverEstoquePecas } from "./useEstoquePecas"
import { OrdemServicoWithDetails } from "./useOrdensServico"

export const useOrdemServicoStockManager = () => {
  const atualizarEstoquePecas = useAtualizarEstoquePecas()
  const devolverEstoquePecas = useDevolverEstoquePecas()

  const processarEstoque = async (
    osAtual: OrdemServicoWithDetails,
    statusAnterior: string,
    novoStatus: string
  ) => {
    const statusAntesFinalizacao = ["Andamento", "Aguardando Peças"]
    const statusFinalizacao = ["Finalizado", "Entregue"]

    if (osAtual.orcamento?.orcamento_pecas && osAtual.orcamento.orcamento_pecas.length > 0) {
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
  }

  return { processarEstoque }
}
