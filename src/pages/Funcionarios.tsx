import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  UserCheck, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Phone,
  MapPin,
  Wrench,
  Paintbrush,
  Droplets
} from "lucide-react"
import { useFuncionarios, useDeleteFuncionario } from "@/hooks/useFuncionarios"
import { FuncionarioForm } from "@/components/FuncionarioForm"
import { EditFuncionarioDialog } from "@/components/EditFuncionarioDialog"

const Funcionarios = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFuncionario, setEditingFuncionario] = useState<any>(null)

  const { data: funcionarios = [], isLoading } = useFuncionarios()
  const deleteFuncionario = useDeleteFuncionario()

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "Mecânico":
        return "bg-primary text-primary-foreground"
      case "Pintor":
        return "bg-secondary text-secondary-foreground"
      case "Lavador":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case "Mecânico":
        return <Wrench className="w-4 h-4" />
      case "Pintor":
        return <Paintbrush className="w-4 h-4" />
      case "Lavador":
        return <Droplets className="w-4 h-4" />
      default:
        return <UserCheck className="w-4 h-4" />
    }
  }

  const filteredFuncionarios = funcionarios.filter(funcionario => {
    const matchesSearch = funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         funcionario.documento.includes(searchTerm)
    
    const matchesCategory = categoryFilter === "all" || funcionario.categoria === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      deleteFuncionario.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setIsDialogOpen(false)
  }

  const handleFormCancel = () => {
    setIsDialogOpen(false)
  }

  const handleEdit = (funcionario: any) => {
    setEditingFuncionario(funcionario)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando funcionários...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funcionários</h1>
          <p className="text-muted-foreground">Gerencie sua equipe de trabalho</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Funcionário</DialogTitle>
            </DialogHeader>
            <FuncionarioForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
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
                  placeholder="Buscar por nome ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Mecânico">Mecânico</SelectItem>
                <SelectItem value="Pintor">Pintor</SelectItem>
                <SelectItem value="Lavador">Lavador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Funcionários */}
      <div className="grid gap-6">
        {filteredFuncionarios.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <UserCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== "all" 
                  ? "Nenhum funcionário encontrado com os filtros aplicados." 
                  : "Nenhum funcionário cadastrado ainda."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFuncionarios.map((funcionario) => (
            <Card key={funcionario.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{funcionario.nome}</CardTitle>
                      <Badge className={getCategoryColor(funcionario.categoria)}>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(funcionario.categoria)}
                          {funcionario.categoria}
                        </div>
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-4 h-4" />
                        {funcionario.documento}
                      </div>
                      {funcionario.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {funcionario.telefone}
                        </div>
                      )}
                    </div>
                    {funcionario.endereco && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {funcionario.endereco}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(funcionario)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(funcionario.id)}
                      disabled={deleteFuncionario.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {editingFuncionario && (
        <EditFuncionarioDialog
          funcionario={editingFuncionario}
          open={!!editingFuncionario}
          onOpenChange={(open) => !open && setEditingFuncionario(null)}
        />
      )}
    </div>
  )
}

export default Funcionarios
