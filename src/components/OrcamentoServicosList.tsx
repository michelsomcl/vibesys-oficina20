
import { useOrcamentoServicos, useCreateOrcamentoServico, useDeleteOrcamentoServico } from "@/hooks/useOrcamentoServicos"
import { OrcamentoServicoItem } from "@/components/orcamento/OrcamentoServicoItem"
import { OrcamentoServicoForm } from "@/components/orcamento/OrcamentoServicoForm"

interface OrcamentoServicosListProps {
  orcamentoId?: string
  localServicos?: LocalServico[]
  setLocalServicos?: (servicos: LocalServico[]) => void
}

interface LocalServico {
  id: string
  servico_id: string
  servico_nome: string
  horas: number
  valor_hora: number
}

export const OrcamentoServicosList = ({ orcamentoId, localServicos = [], setLocalServicos }: OrcamentoServicosListProps) => {
  const { data: orcamentoServicos = [] } = useOrcamentoServicos(orcamentoId)
  const createOrcamentoServico = useCreateOrcamentoServico()
  const deleteOrcamentoServico = useDeleteOrcamentoServico()

  // If has orcamentoId, use database data, otherwise use local data
  const displayServicos = orcamentoId ? orcamentoServicos : localServicos

  const handleAddServico = (servicoId: string, horas: number, valorHora: number) => {
    if (orcamentoId) {
      // If has orcamentoId, save to database
      createOrcamentoServico.mutate({
        orcamento_id: orcamentoId,
        servico_id: servicoId,
        horas,
        valor_hora: valorHora,
      })
    } else {
      // If no orcamentoId, add to local list
      const novoServico: LocalServico = {
        id: Date.now().toString(),
        servico_id: servicoId,
        servico_nome: "", // This will be populated by the form component
        horas,
        valor_hora: valorHora,
      }
      
      if (setLocalServicos) {
        setLocalServicos([...localServicos, novoServico])
      }
    }
  }

  const handleRemoveServico = (id: string) => {
    if (orcamentoId) {
      // Remove from database
      deleteOrcamentoServico.mutate({ id, orcamentoId })
    } else {
      // Remove from local list
      if (setLocalServicos) {
        setLocalServicos(localServicos.filter(s => s.id !== id))
      }
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Serviços</h3>
      
      {/* List of existing services */}
      <div className="space-y-2 mb-4">
        {displayServicos.map((item) => (
          <OrcamentoServicoItem
            key={item.id}
            item={item}
            onRemove={handleRemoveServico}
          />
        ))}
      </div>

      {/* Form to add new service */}
      <OrcamentoServicoForm
        onAddServico={handleAddServico}
        isLoading={createOrcamentoServico.isPending}
      />
    </div>
  )
}
