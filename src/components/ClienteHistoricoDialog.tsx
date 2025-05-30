
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"

interface ClienteHistoricoDialogProps {
  cliente: any
  isOpen: boolean
  onClose: () => void
}

export const ClienteHistoricoDialog = ({ cliente, isOpen, onClose }: ClienteHistoricoDialogProps) => {
  const { data: orcamentos = [], isLoading } = useQuery({
    queryKey: ["cliente-historico", cliente?.id],
    queryFn: async () => {
      if (!cliente?.id) return []
      
      const { data, error } = await supabase
        .from("orcamentos")
        .select(`
          *,
          orcamento_pecas(
            *,
            peca:pecas(*)
          ),
          orcamento_servicos(
            *,
            servico:servicos(*)
          )
        `)
        .eq("cliente_id", cliente.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!cliente?.id && isOpen,
  })

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Orçamentos - {cliente?.nome}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {orcamentos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum orçamento encontrado para este cliente.
              </p>
            ) : (
              orcamentos.map((orcamento) => (
                <Card key={orcamento.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{orcamento.numero}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(orcamento.status)}>
                            {orcamento.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(orcamento.data_orcamento), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          R$ {orcamento.valor_total.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Validade: {format(new Date(orcamento.validade), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
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
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
