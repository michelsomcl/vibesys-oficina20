
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrdemServicoFinancialFormProps {
  valorTotal: number
  desconto: string
  setDesconto: (value: string) => void
  valorPago: string
  setValorPago: (value: string) => void
  formaPagamento: string
  setFormaPagamento: (value: string) => void
}

export const OrdemServicoFinancialForm = ({
  valorTotal,
  desconto,
  setDesconto,
  valorPago,
  setValorPago,
  formaPagamento,
  setFormaPagamento
}: OrdemServicoFinancialFormProps) => {
  const valorComDesconto = valorTotal - (parseFloat(desconto) || 0)
  const valorAPagar = valorComDesconto - parseFloat(valorPago || "0")
  const statusPagamentoCalculado = valorAPagar <= 0 ? "Pago" : "Pendente"

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Financeiro</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Valor Total</Label>
          <Input 
            value={`R$ ${valorTotal.toFixed(2).replace('.', ',')}`}
            disabled
          />
        </div>
        
        <div>
          <Label htmlFor="desconto">Desconto</Label>
          <Input
            id="desconto"
            type="number"
            step="0.01"
            value={desconto}
            onChange={(e) => setDesconto(e.target.value)}
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Valor com Desconto</Label>
          <Input 
            value={`R$ ${valorComDesconto.toFixed(2).replace('.', ',')}`}
            disabled
            className="font-medium"
          />
        </div>
        
        <div>
          <Label htmlFor="valor-pago">Valor Pago</Label>
          <Input
            id="valor-pago"
            type="number"
            step="0.01"
            value={valorPago}
            onChange={(e) => setValorPago(e.target.value)}
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Valor a Pagar</Label>
          <Input 
            value={`R$ ${valorAPagar.toFixed(2).replace('.', ',')}`}
            disabled
            className={valorAPagar <= 0 ? "text-green-600" : "text-red-600"}
          />
        </div>
        
        <div>
          <Label htmlFor="forma-pagamento">Forma de Pagamento</Label>
          <Input
            id="forma-pagamento"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            placeholder="Ex: PIX, Cartão, Dinheiro..."
          />
        </div>
      </div>

      <div>
        <Label>Status do Pagamento</Label>
        <Input 
          value={statusPagamentoCalculado}
          disabled
          className={statusPagamentoCalculado === "Pago" ? "text-green-600 font-medium" : "text-red-600 font-medium"}
        />
        <p className="text-xs text-muted-foreground mt-1">
          * Atualizado automaticamente baseado no valor pago
        </p>
      </div>
    </div>
  )
}
