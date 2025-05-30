
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrdemServicoFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
}

export const OrdemServicoFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}: OrdemServicoFiltersProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por número ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="Andamento">Andamento</SelectItem>
          <SelectItem value="Aguardando Peças">Aguardando Peças</SelectItem>
          <SelectItem value="Finalizado">Finalizado</SelectItem>
          <SelectItem value="Entregue">Entregue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
