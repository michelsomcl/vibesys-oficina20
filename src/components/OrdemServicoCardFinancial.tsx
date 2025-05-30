
interface OrdemServicoCardFinancialProps {
  valorTotal: number
  desconto?: number
  valorPago: number
  formaPagamento?: string
}

export const OrdemServicoCardFinancial = ({ 
  valorTotal, 
  desconto = 0, 
  valorPago, 
  formaPagamento 
}: OrdemServicoCardFinancialProps) => {
  const valorComDesconto = valorTotal - desconto
  const valorAPagarCalculado = valorComDesconto - valorPago

  return (
    <div className="space-y-3">
      <h4 className="font-medium">Financeiro</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Valor Total:</span>
          <span className="font-medium">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
        </div>
        {desconto > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>Desconto:</span>
            <span className="font-medium">R$ {desconto.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        <div className="flex justify-between text-green-600">
          <span>Valor Pago:</span>
          <span className="font-medium">R$ {valorPago.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between text-red-600">
          <span>A Pagar:</span>
          <span className="font-medium">R$ {valorAPagarCalculado.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Forma: {formaPagamento || "Não informado"}
          </p>
        </div>
      </div>
    </div>
  )
}
