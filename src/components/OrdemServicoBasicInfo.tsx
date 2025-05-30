
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrdemServicoWithDetails } from "@/hooks/useOrdensServico"

interface OrdemServicoBasicInfoProps {
  ordemServico: OrdemServicoWithDetails
}

export const OrdemServicoBasicInfo = ({ ordemServico }: OrdemServicoBasicInfoProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Get vehicle info from cliente table if available
  const getVeiculoInfo = () => {
    if (ordemServico.cliente) {
      const { marca, modelo, ano, placa } = ordemServico.cliente
      if (marca && modelo && ano && placa) {
        return `${marca} ${modelo} ${ano} - ${placa}`
      }
    }
    return "Informações do veículo não disponíveis"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Cliente:</strong>
            <p>{ordemServico.cliente?.nome || 'N/A'}</p>
          </div>
          <div>
            <strong>Veículo:</strong>
            <p>{getVeiculoInfo()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Km Atual:</strong>
            <p>{ordemServico.km_atual || 'N/A'}</p>
          </div>
          <div>
            <strong>Data de Início:</strong>
            <p>{formatDate(ordemServico.data_inicio)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Prazo de Conclusão:</strong>
            <p>{formatDate(ordemServico.prazo_conclusao)}</p>
          </div>
          <div>
            <strong>Status do Serviço:</strong>
            <p>{ordemServico.status_servico}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
