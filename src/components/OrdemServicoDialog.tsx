
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, CheckCircle, Package, AlertTriangle, Clock } from "lucide-react"
import { format } from "date-fns"
import { OrdemServicoWithDetails } from "@/hooks/useOrdensServico"

interface OrdemServicoDialogProps {
  ordemServico: OrdemServicoWithDetails | null
  isOpen: boolean
  onClose: () => void
}

export const OrdemServicoDialog = ({ ordemServico, isOpen, onClose }: OrdemServicoDialogProps) => {
  if (!ordemServico) return null

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

  const getVeiculoInfo = () => {
    if (ordemServico.veiculo) {
      return `${ordemServico.veiculo.marca} ${ordemServico.veiculo.modelo} ${ordemServico.veiculo.ano} - ${ordemServico.veiculo.placa}`
    }
    
    if (ordemServico.cliente && ordemServico.cliente.marca && ordemServico.cliente.modelo) {
      return `${ordemServico.cliente.marca} ${ordemServico.cliente.modelo} ${ordemServico.cliente.ano} - ${ordemServico.cliente.placa}`
    }
    
    return 'N/A'
  }

  const valorComDesconto = ordemServico.valor_total - (ordemServico.desconto || 0)
  const valorAPagar = valorComDesconto - ordemServico.valor_pago
  const statusPagamentoCalculado = valorAPagar <= 0 ? "Pago" : "Pendente"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>Ordem de Serviço - {ordemServico.numero}</DialogTitle>
            <Badge className={getStatusColor(ordemServico.status_servico)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(ordemServico.status_servico)}
                {ordemServico.status_servico}
              </div>
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações do Cliente e Veículo */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Dados do Cliente</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Nome:</strong> {ordemServico.cliente?.nome}</p>
                <p><strong>Documento:</strong> {ordemServico.cliente?.documento}</p>
                <p><strong>Telefone:</strong> {ordemServico.cliente?.telefone || 'N/A'}</p>
                <p><strong>Endereço:</strong> {ordemServico.cliente?.endereco || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Dados do Veículo</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Veículo:</strong> {getVeiculoInfo()}</p>
                {ordemServico.km_atual && <p><strong>Km Atual:</strong> {ordemServico.km_atual}</p>}
                {ordemServico.veiculo?.km && (
                  <p><strong>Quilometragem Anterior:</strong> {ordemServico.veiculo.km}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Datas e Prazos */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Cronograma</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Início do Serviço:</strong> {format(new Date(ordemServico.data_inicio), 'dd/MM/yyyy')}</p>
                <p><strong>Prazo de Conclusão:</strong> {format(new Date(ordemServico.prazo_conclusao), 'dd/MM/yyyy')}</p>
                <p><strong>Status do Serviço:</strong> {ordemServico.status_servico}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Informações Financeiras</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Valor Total:</strong> R$ {ordemServico.valor_total.toFixed(2).replace('.', ',')}</p>
                {(ordemServico.desconto || 0) > 0 && (
                  <p className="text-orange-600"><strong>Desconto:</strong> R$ {(ordemServico.desconto || 0).toFixed(2).replace('.', ',')}</p>
                )}
                <p className="font-medium"><strong>Valor com Desconto:</strong> R$ {valorComDesconto.toFixed(2).replace('.', ',')}</p>
                <p className="text-green-600"><strong>Valor Pago:</strong> R$ {ordemServico.valor_pago.toFixed(2).replace('.', ',')}</p>
                <p className="text-red-600"><strong>Valor a Pagar:</strong> R$ {valorAPagar.toFixed(2).replace('.', ',')}</p>
                <p><strong>Forma de Pagamento:</strong> {ordemServico.forma_pagamento || 'N/A'}</p>
                <p><strong>Status do Pagamento:</strong> 
                  <Badge variant={statusPagamentoCalculado === 'Pendente' ? "destructive" : "default"} className="ml-2">
                    {statusPagamentoCalculado}
                  </Badge>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Peças e Serviços */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Peças</h3>
              {ordemServico.orcamento?.orcamento_pecas?.length > 0 ? (
                <div className="space-y-2">
                  {ordemServico.orcamento.orcamento_pecas.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                      <span>{item.quantidade}x {item.peca?.nome}</span>
                      <span>R$ {(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma peça</p>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Serviços</h3>
              {ordemServico.orcamento?.orcamento_servicos?.length > 0 ? (
                <div className="space-y-2">
                  {ordemServico.orcamento.orcamento_servicos.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                      <span>{item.horas}x {item.servico?.nome}</span>
                      <span>R$ {(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum serviço</p>
              )}
            </div>
          </div>

          {/* Observações */}
          {ordemServico.observacao && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Observações</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">{ordemServico.observacao}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
