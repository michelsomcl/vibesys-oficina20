
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { usePecas } from "@/hooks/usePecas"

interface OrcamentoPecaFormProps {
  onAddPeca: (pecaId: string, quantidade: number, valorUnitario: number, pecaNome?: string) => void
  isLoading?: boolean
}

export const OrcamentoPecaForm = ({ onAddPeca, isLoading = false }: OrcamentoPecaFormProps) => {
  const [selectedPecaId, setSelectedPecaId] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [valorUnitario, setValorUnitario] = useState("")

  const { data: pecas = [] } = usePecas()

  const handleAddPeca = () => {
    if (!selectedPecaId || !quantidade || !valorUnitario) {
      return
    }

    const peca = pecas.find(p => p.id === selectedPecaId)
    onAddPeca(selectedPecaId, parseInt(quantidade), parseFloat(valorUnitario), peca?.nome)

    // Limpar campos
    setSelectedPecaId("")
    setQuantidade("")
    setValorUnitario("")
  }

  const handlePecaChange = (pecaId: string) => {
    setSelectedPecaId(pecaId)
    const peca = pecas.find(p => p.id === pecaId)
    if (peca) {
      setValorUnitario(peca.valor_unitario.toString())
    }
  }

  return (
    <div className="grid grid-cols-5 gap-2 items-end">
      <div>
        <label className="text-sm font-medium">Peça</label>
        <Select value={selectedPecaId} onValueChange={handlePecaChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {pecas.map((peca) => (
              <SelectItem key={peca.id} value={peca.id}>
                {peca.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Qtd</label>
        <Input
          type="number"
          placeholder="Qtd"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Valor Unit.</label>
        <Input
          type="number"
          step="0.01"
          placeholder="0,00"
          value={valorUnitario}
          onChange={(e) => setValorUnitario(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Total</label>
        <Input
          value={quantidade && valorUnitario ? 
            `R$ ${(parseFloat(quantidade) * parseFloat(valorUnitario)).toFixed(2)}` : 
            "R$ 0,00"
          }
          readOnly
          className="bg-gray-50"
        />
      </div>
      <Button
        variant="outline"
        onClick={handleAddPeca}
        disabled={!selectedPecaId || !quantidade || !valorUnitario || isLoading}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}
