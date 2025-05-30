
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useOrdensServico, OrdemServicoWithDetails } from "@/hooks/useOrdensServico"
import { OrdemServicoDialog } from "@/components/OrdemServicoDialog"
import { OrdemServicoEditDialog } from "@/components/OrdemServicoEditDialog"
import { OrdemServicoCreateDialog } from "@/components/OrdemServicoCreateDialog"
import { OrdemServicoFilters } from "@/components/OrdemServicoFilters"
import { OrdemServicoList } from "@/components/OrdemServicoList"

const Oficina = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewingOS, setViewingOS] = useState<OrdemServicoWithDetails | null>(null)
  const [editingOS, setEditingOS] = useState<OrdemServicoWithDetails | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data: ordensServico = [], isLoading } = useOrdensServico()

  const filteredOS = ordensServico.filter(os => {
    const matchesSearch = os.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         os.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || os.status_servico === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
          <h1 className="text-3xl font-bold text-foreground">Oficina</h1>
          <p className="text-muted-foreground">Gerencie ordens de serviço e acompanhe o progresso</p>
        </div>
        
        <OrdemServicoCreateDialog 
          isOpen={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
        />
      </div>

      <OrdemServicoFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <OrdemServicoList
        ordensServico={filteredOS}
        onView={setViewingOS}
        onEdit={setEditingOS}
      />

      {filteredOS.length === 0 && ordensServico.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhuma ordem de serviço encontrada. Aprove alguns orçamentos para criar OS automaticamente.
          </p>
        </div>
      )}

      <OrdemServicoDialog 
        ordemServico={viewingOS}
        isOpen={!!viewingOS}
        onClose={() => setViewingOS(null)}
      />

      <OrdemServicoEditDialog 
        ordemServico={editingOS}
        isOpen={!!editingOS}
        onClose={() => setEditingOS(null)}
      />
    </div>
  )
}

export default Oficina
