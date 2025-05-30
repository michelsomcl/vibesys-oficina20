
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from "lucide-react"
import { format } from "date-fns"

interface OrcamentoViewDialogProps {
  orcamento: any
  isOpen: boolean
  onClose: () => void
}

export const OrcamentoViewDialog = ({ orcamento, isOpen, onClose }: OrcamentoViewDialogProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Reprovado":
        return "bg-red-100 text-red-800"
      case "Cancelado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle className="w-4 h-4" />
      case "Pendente":
        return <Clock className="w-4 h-4" />
      case "Reprovado":
        return <XCircle className="w-4 h-4" />
      case "Cancelado":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (!orcamento) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Visualizar Orçamento - {orcamento.numero}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Cliente</Label>
              <p className="text-sm text-muted-foreground">{orcamento.cliente?.nome}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Veículo</Label>
              <p className="text-sm text-muted-foreground">
                {orcamento.veiculo ? `${orcamento.veiculo.marca} ${orcamento.veiculo.modelo} ${orcamento.veiculo.ano} - ${orcamento.veiculo.placa}` : 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Data do Orçamento</Label>
              <p className="text-sm text-muted-foreground">{format(new Date(orcamento.data_orcamento), 'dd/MM/yyyy')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Validade</Label>
              <p className="text-sm text-muted-foreground">{format(new Date(orcamento.validade), 'dd/MM/yyyy')}</p>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Peças</h3>
              <div className="space-y-2">
                {orcamento.orcamento_pecas?.map((item, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{item.peca?.nome}</p>
                      <p className="text-sm text-muted-foreground">Qtd: {item.quantidade}</p>
                    </div>
                    <p className="font-medium">R$ {(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2).replace('.', ',')}</p>
                  </div>
                )) || <p className="text-sm text-muted-foreground">Nenhuma peça</p>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Serviços</h3>
              <div className="space-y-2">
                {orcamento.orcamento_servicos?.map((item, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{item.servico?.nome}</p>
                      <p className="text-sm text-muted-foreground">Qtd: {item.horas}</p>
                    </div>
                    <p className="font-medium">R$ {(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2).replace('.', ',')}</p>
                  </div>
                )) || <p className="text-sm text-muted-foreground">Nenhum serviço</p>}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(orcamento.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(orcamento.status)}
                  {orcamento.status}
                </div>
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-primary">
                R$ {orcamento.valor_total.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
