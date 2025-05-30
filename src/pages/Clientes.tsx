import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Users, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Car,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  History
} from "lucide-react"
import { useClientes, useDeleteCliente } from "@/hooks/useClientes"
import { ClientForm } from "@/components/ClientForm"
import { EditClienteDialog } from "@/components/EditClienteDialog"
import { ClienteHistoricoDialog } from "@/components/ClienteHistoricoDialog"

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [clientType, setClientType] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<any>(null)
  const [historicoCliente, setHistoricoCliente] = useState<any>(null)

  const { data: clientes = [], isLoading } = useClientes()
  const deleteCliente = useDeleteCliente()

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.documento.includes(searchTerm) ||
                         (cliente.placa && cliente.placa.includes(searchTerm))
    
    const matchesType = clientType === "all" || cliente.tipo === clientType
    
    return matchesSearch && matchesType
  })

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteCliente.mutate(id)
    }
  }

  const handleEdit = (cliente: any) => {
    setEditingCliente(cliente)
  }

  const handleHistorico = (cliente: any) => {
    setHistoricoCliente(cliente)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e veículos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm 
              onSuccess={() => setIsDialogOpen(false)} 
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CPF/CNPJ ou placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={clientType} onValueChange={setClientType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo de cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PF">Pessoa Física</SelectItem>
                <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-6">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{cliente.nome}</CardTitle>
                    <Badge variant={cliente.tipo === "PF" ? "default" : "secondary"}>
                      {cliente.tipo}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {cliente.documento}
                    </div>
                    {cliente.telefone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {cliente.telefone}
                      </div>
                    )}
                    {cliente.aniversario && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {cliente.aniversario}
                      </div>
                    )}
                  </div>
                  {cliente.endereco && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {cliente.endereco}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleHistorico(cliente)}>
                    <History className="w-4 h-4" />
                    Histórico
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(cliente.id)}
                    disabled={deleteCliente.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {(cliente.marca || cliente.modelo || cliente.ano || cliente.placa) && (
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Veículo
                  </h4>
                  <div className="flex flex-wrap gap-4 p-3 bg-muted rounded-lg text-sm">
                    {cliente.marca && <span><strong>Marca:</strong> {cliente.marca}</span>}
                    {cliente.modelo && <span><strong>Modelo:</strong> {cliente.modelo}</span>}
                    {cliente.ano && <span><strong>Ano:</strong> {cliente.ano}</span>}
                    {cliente.placa && <span><strong>Placa:</strong> {cliente.placa}</span>}
                    {cliente.quilometragem && <span><strong>KM:</strong> {cliente.quilometragem}</span>}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
        </div>
      )}

      {editingCliente && (
        <EditClienteDialog
          cliente={editingCliente}
          open={!!editingCliente}
          onOpenChange={(open) => !open && setEditingCliente(null)}
        />
      )}

      {historicoCliente && (
        <ClienteHistoricoDialog
          cliente={historicoCliente}
          isOpen={!!historicoCliente}
          onClose={() => setHistoricoCliente(null)}
        />
      )}
    </div>
  )
}

export default Clientes
