
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useOrcamentos, useDeleteOrcamento } from "@/hooks/useOrcamentos"
import { OrcamentoCard } from "@/components/OrcamentoCard"
import { OrcamentoFilters } from "@/components/OrcamentoFilters"
import { OrcamentoViewDialog } from "@/components/OrcamentoViewDialog"
import { OrcamentoEditDialog } from "@/components/OrcamentoEditDialog"
import { OrcamentoCreateDialog } from "@/components/OrcamentoCreateDialog"
import { printOrcamento } from "@/utils/orcamentoPrintUtils"

const Orcamentos = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewingOrcamento, setViewingOrcamento] = useState<any>(null)
  const [editingOrcamento, setEditingOrcamento] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: orcamentos = [], isLoading } = useOrcamentos()
  const deleteOrcamento = useDeleteOrcamento()

  const filteredOrcamentos = orcamentos.filter(orcamento => {
    const matchesSearch = orcamento.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orcamento.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || orcamento.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleView = (orcamento: any) => {
    setViewingOrcamento(orcamento)
  }

  const handleEdit = (orcamento: any) => {
    setEditingOrcamento(orcamento)
  }

  const handleDelete = (id: string) => {
    deleteOrcamento.mutate(id)
  }

  const getVeiculoInfo = (orcamento: any) => {
    if (orcamento.veiculo) {
      return `${orcamento.veiculo.marca} ${orcamento.veiculo.modelo} ${orcamento.veiculo.ano} - ${orcamento.veiculo.placa}`
    }
    
    if (orcamento.cliente && orcamento.cliente.marca && orcamento.cliente.modelo) {
      return `${orcamento.cliente.marca} ${orcamento.cliente.modelo} ${orcamento.cliente.ano} - ${orcamento.cliente.placa}`
    }
    
    return 'N/A'
  }

  const handleImprimir = (orcamento: any) => {
    printOrcamento(orcamento, getVeiculoInfo)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
          <p className="text-muted-foreground">Gerencie orçamentos e aprovações</p>
        </div>
        
        <OrcamentoCreateDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>

      <OrcamentoFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="grid gap-6">
        {filteredOrcamentos.map((orcamento) => (
          <OrcamentoCard 
            key={orcamento.id}
            orcamento={orcamento}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onImprimir={handleImprimir}
          />
        ))}
      </div>

      {filteredOrcamentos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum orçamento encontrado.</p>
        </div>
      )}

      <OrcamentoViewDialog 
        orcamento={viewingOrcamento}
        isOpen={!!viewingOrcamento}
        onClose={() => setViewingOrcamento(null)}
      />

      <OrcamentoEditDialog 
        orcamento={editingOrcamento}
        isOpen={!!editingOrcamento}
        onClose={() => setEditingOrcamento(null)}
      />
    </div>
  )
}

export default Orcamentos
