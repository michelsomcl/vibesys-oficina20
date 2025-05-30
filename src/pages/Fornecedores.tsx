import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, Plus, Search, Pencil, Trash2, Phone, MapPin, Mail } from "lucide-react"
import { useFornecedores, useCreateFornecedor, useDeleteFornecedor } from "@/hooks/useFornecedores"
import { TablesInsert } from "@/integrations/supabase/types"
import { EditFornecedorDialog } from "@/components/EditFornecedorDialog"

const FornecedorForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [fornecedorData, setFornecedorData] = useState<TablesInsert<"fornecedores">>({
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: "",
  })

  const createFornecedor = useCreateFornecedor()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fornecedorData.nome || !fornecedorData.cnpj) {
      return
    }

    createFornecedor.mutate(fornecedorData, {
      onSuccess: () => {
        setFornecedorData({
          nome: "",
          cnpj: "",
          telefone: "",
          email: "",
          endereco: "",
        })
        onSuccess?.()
      }
    })
  }

  const handleCancel = () => {
    setFornecedorData({
      nome: "",
      cnpj: "",
      telefone: "",
      email: "",
      endereco: "",
    })
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome da Empresa</Label>
          <Input 
            id="nome" 
            placeholder="Nome do fornecedor" 
            value={fornecedorData.nome}
            onChange={(e) => setFornecedorData(prev => ({ ...prev, nome: e.target.value }))} 
            required
          />
        </div>
        <div>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input 
            id="cnpj" 
            placeholder="00.000.000/0000-00" 
            value={fornecedorData.cnpj}
            onChange={(e) => setFornecedorData(prev => ({ ...prev, cnpj: e.target.value }))} 
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input 
            id="telefone" 
            placeholder="(11) 99999-9999" 
            value={fornecedorData.telefone}
            onChange={(e) => setFornecedorData(prev => ({ ...prev, telefone: e.target.value }))} 
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            type="email"
            placeholder="contato@fornecedor.com" 
            value={fornecedorData.email}
            onChange={(e) => setFornecedorData(prev => ({ ...prev, email: e.target.value }))} 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="endereco">Endereço</Label>
        <Input 
          id="endereco" 
          placeholder="Endereço completo" 
          value={fornecedorData.endereco}
          onChange={(e) => setFornecedorData(prev => ({ ...prev, endereco: e.target.value }))} 
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90"
          disabled={createFornecedor.isPending}
        >
          {createFornecedor.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  )
}

const Fornecedores = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFornecedor, setEditingFornecedor] = useState<any>(null)

  const { data: fornecedores = [], isLoading } = useFornecedores()
  const deleteFornecedor = useDeleteFornecedor()

  const filteredFornecedores = fornecedores.filter(fornecedor => 
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj.includes(searchTerm)
  )

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      deleteFornecedor.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setIsDialogOpen(false)
  }

  const handleEdit = (fornecedor: any) => {
    setEditingFornecedor(fornecedor)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando fornecedores...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie seus fornecedores</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Fornecedor</DialogTitle>
            </DialogHeader>
            <FornecedorForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Fornecedores */}
      <div className="grid gap-6">
        {filteredFornecedores.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Nenhum fornecedor encontrado com os filtros aplicados." 
                  : "Nenhum fornecedor cadastrado ainda."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFornecedores.map((fornecedor) => (
            <Card key={fornecedor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{fornecedor.nome}</CardTitle>
                      <Badge variant="outline">
                        <Building2 className="w-3 h-3 mr-1" />
                        Fornecedor
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {fornecedor.cnpj}
                      </div>
                      {fornecedor.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {fornecedor.telefone}
                        </div>
                      )}
                      {fornecedor.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {fornecedor.email}
                        </div>
                      )}
                    </div>
                    {fornecedor.endereco && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {fornecedor.endereco}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(fornecedor)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(fornecedor.id)}
                      disabled={deleteFornecedor.isPending}
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

      {editingFornecedor && (
        <EditFornecedorDialog
          fornecedor={editingFornecedor}
          open={!!editingFornecedor}
          onOpenChange={(open) => !open && setEditingFornecedor(null)}
        />
      )}
    </div>
  )
}

export default Fornecedores
