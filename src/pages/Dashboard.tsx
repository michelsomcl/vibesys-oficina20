
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  FileText, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

const Dashboard = () => {
  // Dados mock para demonstração
  const stats = [
    { title: "Clientes Ativos", value: "247", icon: Users, color: "bg-primary" },
    { title: "Orçamentos Pendentes", value: "12", icon: FileText, color: "bg-secondary" },
    { title: "Faturamento Mensal", value: "R$ 45.230", icon: DollarSign, color: "bg-accent" },
    { title: "Serviços em Andamento", value: "8", icon: Clock, color: "bg-muted" },
  ]

  const recentOrders = [
    { id: "OS-001", cliente: "João Silva", veiculo: "Civic 2020", status: "Em andamento", valor: "R$ 1.200" },
    { id: "OS-002", cliente: "Maria Santos", veiculo: "Corolla 2019", status: "Aguardando peça", valor: "R$ 850" },
    { id: "OS-003", cliente: "Carlos Lima", veiculo: "Focus 2018", status: "Concluído", valor: "R$ 650" },
  ]

  const aniversariantes = [
    { nome: "Ana Costa", data: "15/12", telefone: "(11) 98765-4321" },
    { nome: "Pedro Oliveira", data: "18/12", telefone: "(11) 91234-5678" },
    { nome: "Lucia Ferreira", data: "22/12", telefone: "(11) 95555-0000" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-800"
      case "Em andamento":
        return "bg-blue-100 text-blue-800"
      case "Aguardando peça":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ordens de Serviço Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ordens de Serviço Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{order.id}</div>
                    <div className="text-sm text-muted-foreground">{order.cliente}</div>
                    <div className="text-xs text-muted-foreground">{order.veiculo}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <div className="text-sm font-medium text-foreground">{order.valor}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aniversariantes do Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aniversariantes - Dezembro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aniversariantes.map((pessoa, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{pessoa.nome}</div>
                    <div className="text-sm text-muted-foreground">{pessoa.telefone}</div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-accent text-accent-foreground">
                      {pessoa.data}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">R$ 15.420</div>
              <div className="text-sm text-muted-foreground">Contas Recebidas</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">R$ 8.950</div>
              <div className="text-sm text-muted-foreground">Contas a Receber</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">R$ 3.200</div>
              <div className="text-sm text-muted-foreground">Contas em Atraso</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
