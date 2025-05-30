
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useServicos } from "@/hooks/useServicos"

interface OrcamentoServicoFormProps {
  onAddServico: (servicoId: string, horas: number, valorHora: number) => void
  isLoading?: boolean
}

export const OrcamentoServicoForm = ({ onAddServico, isLoading = false }: OrcamentoServicoFormProps) => {
  const [selectedServicoId, setSelectedServicoId] = useState("")
  const [horas, setHoras] = useState("")
  const [valorHora, setValorHora] = useState("")

  const { data: servicos = [] } = useServicos()

  const handleAddServico = () => {
    if (!selectedServicoId || !horas || !valorHora) {
      return
    }

    onAddServico(selectedServicoId, parseFloat(horas), parseFloat(valorHora))

    // Clear fields
    setSelectedServicoId("")
    setHoras("")
    setValorHora("")
  }

  const handleServicoChange = (servicoId: string) => {
    setSelectedServicoId(servicoId)
    const servico = servicos.find(s => s.id === servicoId)
    if (servico) {
      setValorHora(servico.valor_hora.toString())
    }
  }

  return (
    <div className="grid grid-cols-5 gap-2 items-end">
      <div>
        <label className="text-sm font-medium">Serviço</label>
        <Select value={selectedServicoId} onValueChange={handleServicoChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {servicos.map((servico) => (
              <SelectItem key={servico.id} value={servico.id}>
                {servico.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Qtd</label>
        <Input
          type="number"
          step="0.5"
          placeholder="Qtd"
          value={horas}
          onChange={(e) => setHoras(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Valor</label>
        <Input
          type="number"
          step="0.01"
          placeholder="0,00"
          value={valorHora}
          onChange={(e) => setValorHora(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Total</label>
        <Input
          value={horas && valorHora ? 
            `R$ ${(parseFloat(horas) * parseFloat(valorHora)).toFixed(2)}` : 
            "R$ 0,00"
          }
          readOnly
          className="bg-gray-50"
        />
      </div>
      <Button
        variant="outline"
        onClick={handleAddServico}
        disabled={!selectedServicoId || !horas || !valorHora || isLoading}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}
