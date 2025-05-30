
import { Badge } from "@/components/ui/badge"
import { Settings, CheckCircle, Clock, AlertTriangle, Package } from "lucide-react"

interface OrdemServicoCardStatusProps {
  status: string
}

export const OrdemServicoCardStatus = ({ status }: OrdemServicoCardStatusProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Andamento":
        return <Settings className="w-4 h-4" />
      case "Aguardando Peças":
        return <Package className="w-4 h-4" />
      case "Finalizado":
        return <CheckCircle className="w-4 h-4" />
      case "Entregue":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Andamento":
        return "bg-blue-100 text-blue-800"
      case "Aguardando Peças":
        return "bg-yellow-100 text-yellow-800"
      case "Finalizado":
        return "bg-green-100 text-green-800"
      case "Entregue":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Badge className={getStatusColor(status)}>
      <div className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </div>
    </Badge>
  )
}
