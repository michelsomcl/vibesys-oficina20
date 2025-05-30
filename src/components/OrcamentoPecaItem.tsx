
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { usePecas } from "@/hooks/usePecas"

interface OrcamentoPecaItemProps {
  item: any
  onRemove: (id: string) => void
}

export const OrcamentoPecaItem = ({ item, onRemove }: OrcamentoPecaItemProps) => {
  const { data: pecas = [] } = usePecas()
  
  // Para dados do banco vs dados locais
  const isFromDatabase = 'peca' in item
  
  // Se for dados locais, buscar o nome da peça pelo ID
  const getNomePeca = () => {
    if (isFromDatabase) {
      return item.peca?.nome
    } else {
      const peca = pecas.find(p => p.id === item.peca_id)
      return peca?.nome || item.peca_nome
    }
  }
  
  const nome = getNomePeca()
  const quantidade = item.quantidade
  const valorUnitario = isFromDatabase ? parseFloat(item.valor_unitario.toString()) : item.valor_unitario
  const total = quantidade * valorUnitario

  return (
    <div className="grid grid-cols-5 gap-2 items-center p-2 border rounded">
      <span className="text-sm">{nome}</span>
      <span className="text-sm text-center">{quantidade}</span>
      <span className="text-sm text-center">R$ {valorUnitario.toFixed(2)}</span>
      <span className="text-sm text-center font-medium">
        R$ {total.toFixed(2)}
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
