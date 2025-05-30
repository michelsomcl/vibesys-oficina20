
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface OrcamentoServicoItemProps {
  item: any
  onRemove: (id: string) => void
}

export const OrcamentoServicoItem = ({ item, onRemove }: OrcamentoServicoItemProps) => {
  // For database data
  if ('servico' in item) {
    return (
      <div className="grid grid-cols-5 gap-2 items-center p-2 border rounded">
        <span className="text-sm">{item.servico?.nome}</span>
        <span className="text-sm text-center">{item.horas}</span>
        <span className="text-sm text-center">R$ {item.valor_hora.toString()}</span>
        <span className="text-sm text-center font-medium">
          R$ {(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 p-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  } else {
    // For local data
    return (
      <div className="grid grid-cols-5 gap-2 items-center p-2 border rounded">
        <span className="text-sm">{item.servico_nome}</span>
        <span className="text-sm text-center">{item.horas}</span>
        <span className="text-sm text-center">R$ {item.valor_hora.toString()}</span>
        <span className="text-sm text-center font-medium">
          R$ {(item.horas * item.valor_hora).toFixed(2)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 p-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  }
}
