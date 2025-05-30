
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Banknote,
  Smartphone
} from "lucide-react"

const Financeiro = () => {
  // Dados mock para demonstração
  const contasAReceber = [
    {
      id: "CR-001",
      cliente: "João Silva",
      orcamento: "ORC-001",
      valor: 1250.00,
      vencimento: "20/12/2024",
      status: "Pendente"
    },
    {
      id: "CR-002",
      cliente: "Maria Santos",
      orcamento: "ORC-002",
      valor: 850.00,
      vencimento: "18/12/2024",
      status: "Atrasado"
    }
  ]

  const contasRecebidas = [
    {
      id: "CR-003",
      cliente: "Carlos Lima",
      orcamento: "ORC-003",
      valor: 650.00,
      dataRecebimento: "15/12/2024",
      formaPagamento: "PIX",
      status: "Recebido"
    },
    {
      id: "CR-004",
      cliente: "Ana Costa",
      orcamento: "ORC-004",
      valor: 920.00,
      dataRecebimento: "14/12/2024",
      formaPagamento: "Cartão",
      status: "Recebido"
    }
  ]

  const contasGerais = [
    {
      id: "CG-001",
      descricao: "Aluguel da Oficina",
      tipo: "Fixa",
      valor: 2500.00,
      vencimento: "05/01/2025",
      status: "Pendente"
    },
    {
      id: "CG-002",
      descricao: "Energia Elétrica",
      tipo: "Variável",
      valor: 420.00,
      vencimento: "10/12/2024",
      status: "Pago"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recebido":
      case "Pago":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Atrasado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentIcon = (tipo: string) => {
    switch (tipo) {
      case "PIX":
        return <Smartphone className="w-4 h-4" />
      case "Cartão":
        return <CreditCard className="w-4 h-4" />
      case "Dinheiro":
        return <Banknote className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
        <p className="text-muted-foreground">Controle suas finanças e recebimentos</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">R$ 8.950</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebido no Mês</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 15.420</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 3.200</div>
            <p className="text-xs text-muted-foreground">5 contas em atraso</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ 5.680</div>
            <p className="text-xs text-muted-foreground">-3% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Abas do Financeiro */}
      <Tabs defaultValue="a-receber" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="a-receber">Contas a Receber</TabsTrigger>
          <TabsTrigger value="recebidas">Contas Recebidas</TabsTrigger>
          <TabsTrigger value="gerais">Contas Gerais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="a-receber">
          <Card>
            <CardHeader>
              <CardTitle>Contas a Receber</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contasAReceber.map((conta) => (
                  <div key={conta.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{conta.id}</div>
                      <div className="text-sm text-muted-foreground">{conta.cliente}</div>
                      <div className="text-xs text-muted-foreground">Orçamento: {conta.orcamento}</div>
                      <div className="text-xs text-muted-foreground">Vencimento: {conta.vencimento}</div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-lg font-bold">R$ {conta.valor.toFixed(2).replace('.', ',')}</div>
                      <Badge className={getStatusColor(conta.status)}>
                        {conta.status}
                      </Badge>
                      <div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Receber
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recebidas">
          <Card>
            <CardHeader>
              <CardTitle>Contas Recebidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contasRecebidas.map((conta) => (
                  <div key={conta.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{conta.id}</div>
                      <div className="text-sm text-muted-foreground">{conta.cliente}</div>
                      <div className="text-xs text-muted-foreground">Orçamento: {conta.orcamento}</div>
                      <div className="text-xs text-muted-foreground">Recebido em: {conta.dataRecebimento}</div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-lg font-bold text-green-600">R$ {conta.valor.toFixed(2).replace('.', ',')}</div>
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(conta.formaPagamento)}
                        <span className="text-sm">{conta.formaPagamento}</span>
                      </div>
                      <Badge className={getStatusColor(conta.status)}>
                        {conta.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gerais">
          <Card>
            <CardHeader>
              <CardTitle>Contas Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contasGerais.map((conta) => (
                  <div key={conta.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{conta.descricao}</div>
                      <div className="text-sm text-muted-foreground">Tipo: {conta.tipo}</div>
                      <div className="text-xs text-muted-foreground">Vencimento: {conta.vencimento}</div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-lg font-bold">R$ {conta.valor.toFixed(2).replace('.', ',')}</div>
                      <Badge className={getStatusColor(conta.status)}>
                        {conta.status}
                      </Badge>
                      {conta.status === "Pendente" && (
                        <div>
                          <Button size="sm" variant="outline">
                            Pagar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Financeiro
