
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Pencil, 
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Printer,
  Wrench
} from "lucide-react"
import { format } from "date-fns"
import { useUpdateOrcamento } from "@/hooks/useOrcamentos"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OrcamentoCardProps {
  orcamento: any
  onView: (orcamento: any) => void
  onEdit: (orcamento: any) => void
  onDelete: (id: string) => void
  onImprimir?: (orcamento: any) => void
}

export const OrcamentoCard = ({ orcamento, onView, onEdit, onDelete, onImprimir }: OrcamentoCardProps) => {
  const updateOrcamento = useUpdateOrcamento()
  const queryClient = useQueryClient()

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

  const statusOptions = ["Pendente", "Aprovado", "Reprovado", "Cancelado"]

  const handleStatusChange = async (newStatus: string) => {
    const previousStatus = orcamento.status
    
    try {
      await updateOrcamento.mutateAsync({
        id: orcamento.id,
        status: newStatus as any
      })
      
      // Se mudou para Aprovado, mostra toast informando sobre a criação da OS
      if (newStatus === "Aprovado" && previousStatus !== "Aprovado") {
        toast.success("Orçamento aprovado! Uma ordem de serviço foi criada automaticamente na Oficina.")
        // Invalida queries da oficina para atualizar os dados
        queryClient.invalidateQueries({ queryKey: ["ordens_servico"] })
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast.error("Erro ao atualizar status do orçamento")
    }
  }

  // Determina as informações do veículo
  const getVeiculoInfo = () => {
    // Primeiro tenta obter do objeto veiculo
    if (orcamento.veiculo) {
      return `${orcamento.veiculo.marca} ${orcamento.veiculo.modelo} ${orcamento.veiculo.ano} - ${orcamento.veiculo.placa}`
    }
    
    // Se não há veiculo, tenta obter do cliente
    if (orcamento.cliente && orcamento.cliente.marca && orcamento.cliente.modelo) {
      return `${orcamento.cliente.marca} ${orcamento.cliente.modelo} ${orcamento.cliente.ano} - ${orcamento.cliente.placa}`
    }
    
    return 'N/A'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{orcamento.numero}</CardTitle>
              <Select value={orcamento.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-auto">
                  <Badge className={getStatusColor(orcamento.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(orcamento.status)}
                      <SelectValue />
                    </div>
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        {status}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-muted-foreground space-y-1">
              <p><strong>Cliente:</strong> {orcamento.cliente?.nome}</p>
              {orcamento.cliente?.telefone && (
                <p><strong>Telefone:</strong> {orcamento.cliente.telefone}</p>
              )}
              <p><strong>Veículo:</strong> {getVeiculoInfo()}</p>
              {orcamento.km_atual && (
                <p><strong>Km Atual:</strong> {orcamento.km_atual}</p>
              )}
              <p><strong>Data:</strong> {format(new Date(orcamento.data_orcamento), 'dd/MM/yyyy')} | <strong>Validade:</strong> {format(new Date(orcamento.validade), 'dd/MM/yyyy')}</p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="text-2xl font-bold text-primary">
              R$ {orcamento.valor_total.toFixed(2).replace('.', ',')}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(orcamento)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(orcamento)}>
                <Pencil className="w-4 h-4" />
              </Button>
              {onImprimir && (
                <Button variant="outline" size="sm" onClick={() => onImprimir(orcamento)}>
                  <Printer className="w-4 h-4" />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o orçamento {orcamento.numero}? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(orcamento.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {orcamento.status === "Aprovado" && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = '/oficina'}
                >
                  <Wrench className="w-4 h-4 mr-1" />
                  Ver na Oficina
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Peças */}
          <div>
            <h4 className="font-medium mb-2">Peças</h4>
            <div className="space-y-1">
              {orcamento.orcamento_pecas?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantidade}x {item.peca?.nome}</span>
                  <span>R$ {(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2).replace('.', ',')}</span>
                </div>
              )) || <span className="text-sm text-muted-foreground">Nenhuma peça</span>}
            </div>
          </div>
          
          {/* Serviços */}
          <div>
            <h4 className="font-medium mb-2">Serviços</h4>
            <div className="space-y-1">
              {orcamento.orcamento_servicos?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.horas}h {item.servico?.nome}</span>
                  <span>R$ {(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2).replace('.', ',')}</span>
                </div>
              )) || <span className="text-sm text-muted-foreground">Nenhum serviço</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
