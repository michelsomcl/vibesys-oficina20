
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Pencil, Trash2, Printer } from "lucide-react"
import { OrdemServicoWithDetails, useDeleteOrdemServico } from "@/hooks/useOrdensServico"
import { OrdemServicoCardStatus } from "./OrdemServicoCardStatus"
import { OrdemServicoCardFinancial } from "./OrdemServicoCardFinancial"
import { printOrdemServico } from "@/utils/ordemServicoPrintUtils"

interface OrdemServicoCardProps {
  ordemServico: OrdemServicoWithDetails
  onView: (os: OrdemServicoWithDetails) => void
  onEdit: (os: OrdemServicoWithDetails) => void
}

export const OrdemServicoCard = ({ ordemServico, onView, onEdit }: OrdemServicoCardProps) => {
  const deleteOrdemServico = useDeleteOrdemServico()

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta ordem de serviço?")) {
      try {
        await deleteOrdemServico.mutateAsync(ordemServico.id)
      } catch (error) {
        console.error("Erro ao excluir ordem de serviço:", error)
      }
    }
  }

  const handlePrint = () => {
    printOrdemServico(ordemServico)
  }

  const getVeiculoInfo = () => {
    if (ordemServico.veiculo) {
      return `${ordemServico.veiculo.marca} ${ordemServico.veiculo.modelo} ${ordemServico.veiculo.ano} - ${ordemServico.veiculo.placa}`
    }
    
    if (ordemServico.cliente && ordemServico.cliente.marca && ordemServico.cliente.modelo) {
      return `${ordemServico.cliente.marca} ${ordemServico.cliente.modelo} ${ordemServico.cliente.ano} - ${ordemServico.cliente.placa}`
    }
    
    return 'N/A'
  }

  // Calcular status do pagamento baseado nos valores
  const valorComDesconto = ordemServico.valor_total - (ordemServico.desconto || 0)
  const valorAPagar = valorComDesconto - ordemServico.valor_pago
  const statusPagamentoCalculado = valorAPagar <= 0 ? "Pago" : "Pendente"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            OS {ordemServico.numero}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={statusPagamentoCalculado === 'Pendente' ? "destructive" : "default"}>
              {statusPagamentoCalculado}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(ordemServico)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(ordemServico)}
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="h-8 w-8 p-0"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                disabled={deleteOrdemServico.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">Informações Básicas</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Cliente:</strong> {ordemServico.cliente?.nome}</p>
                <p><strong>Veículo:</strong> {getVeiculoInfo()}</p>
                <p><strong>Km Atual:</strong> {ordemServico.km_atual || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium">Cronograma</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Início:</strong> {format(new Date(ordemServico.data_inicio), 'dd/MM/yyyy')}</p>
                <p><strong>Prazo:</strong> {format(new Date(ordemServico.prazo_conclusao), 'dd/MM/yyyy')}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <OrdemServicoCardStatus status={ordemServico.status_servico} />
            <OrdemServicoCardFinancial
              valorTotal={ordemServico.valor_total}
              desconto={ordemServico.desconto}
              valorPago={ordemServico.valor_pago}
              formaPagamento={ordemServico.forma_pagamento}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
