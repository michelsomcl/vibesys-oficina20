
import { useState } from "react"
import { useOrcamentoPecas, useCreateOrcamentoPeca, useDeleteOrcamentoPeca } from "@/hooks/useOrcamentoPecas"
import { OrcamentoPecaForm } from "@/components/OrcamentoPecaForm"
import { OrcamentoPecaItem } from "@/components/OrcamentoPecaItem"

interface OrcamentoPecasListProps {
  orcamentoId?: string
  localPecas?: LocalPeca[]
  setLocalPecas?: (pecas: LocalPeca[]) => void
}

interface LocalPeca {
  id: string
  peca_id: string
  peca_nome: string
  quantidade: number
  valor_unitario: number
}

export const OrcamentoPecasList = ({ orcamentoId, localPecas = [], setLocalPecas }: OrcamentoPecasListProps) => {
  const { data: orcamentoPecas = [] } = useOrcamentoPecas(orcamentoId)
  const createOrcamentoPeca = useCreateOrcamentoPeca()
  const deleteOrcamentoPeca = useDeleteOrcamentoPeca()

  // Se tem orcamentoId, usa dados do banco, senão usa dados locais
  const displayPecas = orcamentoId ? orcamentoPecas : localPecas

  const handleAddPeca = (pecaId: string, quantidade: number, valorUnitario: number, pecaNome?: string) => {
    if (orcamentoId) {
      // Se tem orcamentoId, salva no banco
      createOrcamentoPeca.mutate({
        orcamento_id: orcamentoId,
        peca_id: pecaId,
        quantidade,
        valor_unitario: valorUnitario,
      })
    } else {
      // Se não tem orcamentoId, adiciona na lista local
      const novaPeca: LocalPeca = {
        id: Date.now().toString(),
        peca_id: pecaId,
        peca_nome: pecaNome || "Nome da Peça",
        quantidade,
        valor_unitario: valorUnitario,
      }
      
      if (setLocalPecas) {
        setLocalPecas([...localPecas, novaPeca])
      }
    }
  }

  const handleRemovePeca = (id: string) => {
    if (orcamentoId) {
      // Remove do banco
      deleteOrcamentoPeca.mutate({ id, orcamentoId })
    } else {
      // Remove da lista local
      if (setLocalPecas) {
        setLocalPecas(localPecas.filter(p => p.id !== id))
      }
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Peças</h3>
      
      <div className="space-y-2 mb-4">
        {displayPecas.map((item) => (
          <OrcamentoPecaItem
            key={item.id}
            item={item}
            onRemove={handleRemovePeca}
          />
        ))}
      </div>

      <OrcamentoPecaForm
        onAddPeca={handleAddPeca}
        isLoading={createOrcamentoPeca.isPending}
      />
    </div>
  )
}
