
import { OrdemServicoCard } from "./OrdemServicoCard"
import { OrdemServicoWithDetails } from "@/hooks/useOrdensServico"

interface OrdemServicoListProps {
  ordensServico: OrdemServicoWithDetails[]
  onView: (os: OrdemServicoWithDetails) => void
  onEdit: (os: OrdemServicoWithDetails) => void
}

export const OrdemServicoList = ({ ordensServico, onView, onEdit }: OrdemServicoListProps) => {
  if (ordensServico.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhuma ordem de serviço encontrada com os filtros aplicados.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {ordensServico.map((os) => (
        <OrdemServicoCard
          key={os.id}
          ordemServico={os}
          onView={onView}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
