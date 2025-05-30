
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateOrdemServico, OrdemServicoWithDetails } from "@/hooks/useOrdensServico"
import { Separator } from "@/components/ui/separator"
import { Printer } from "lucide-react"
import { OrdemServicoBasicInfo } from "@/components/OrdemServicoBasicInfo"
import { OrdemServicoFinancialForm } from "@/components/OrdemServicoFinancialForm"
import { printOrdemServico } from "@/utils/ordemServicoPrintUtils"

interface OrdemServicoEditDialogProps {
  ordemServico: OrdemServicoWithDetails | null
  isOpen: boolean
  onClose: () => void
}

export const OrdemServicoEditDialog = ({ ordemServico, isOpen, onClose }: OrdemServicoEditDialogProps) => {
  const [statusServico, setStatusServico] = useState("")
  const [valorPago, setValorPago] = useState("")
  const [formaPagamento, setFormaPagamento] = useState("")
  const [observacao, setObservacao] = useState("")
  const [desconto, setDesconto] = useState("")
  
  const updateOrdemServico = useUpdateOrdemServico()

  useEffect(() => {
    if (ordemServico) {
      setStatusServico(ordemServico.status_servico)
      setValorPago(ordemServico.valor_pago.toString())
      setFormaPagamento(ordemServico.forma_pagamento || "")
      setObservacao(ordemServico.observacao || "")
      setDesconto(ordemServico.desconto?.toString() || "0")
    }
  }, [ordemServico])

  const handleSave = async () => {
    if (!ordemServico) return

    try {
      await updateOrdemServico.mutateAsync({
        id: ordemServico.id,
        status_servico: statusServico as any,
        valor_pago: parseFloat(valorPago) || 0,
        forma_pagamento: formaPagamento || null,
        observacao: observacao || null,
        desconto: parseFloat(desconto) || 0,
      })
      onClose()
    } catch (error) {
      console.error("Erro ao salvar:", error)
    }
  }

  const handlePrint = () => {
    if (!ordemServico) return
    printOrdemServico(ordemServico)
  }

  if (!ordemServico) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Editar OS {ordemServico.numero}</DialogTitle>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <OrdemServicoBasicInfo ordemServico={ordemServico} />

          <Separator />

          <div>
            <Label htmlFor="status-servico">Status do Serviço</Label>
            <Select value={statusServico} onValueChange={setStatusServico}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Andamento">Andamento</SelectItem>
                <SelectItem value="Aguardando Peças">Aguardando Peças</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Digite observações sobre o serviço..."
              rows={3}
            />
          </div>

          <Separator />

          <OrdemServicoFinancialForm
            valorTotal={ordemServico.valor_total}
            desconto={desconto}
            setDesconto={setDesconto}
            valorPago={valorPago}
            setValorPago={setValorPago}
            formaPagamento={formaPagamento}
            setFormaPagamento={setFormaPagamento}
          />

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={updateOrdemServico.isPending}>
              {updateOrdemServico.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
