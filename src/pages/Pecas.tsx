import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, Plus, Search, Pencil, Trash2, DollarSign } from "lucide-react"
import { usePecas, useCreatePeca, useDeletePeca } from "@/hooks/usePecas"
import { TablesInsert } from "@/integrations/supabase/types"
import { EditPecaDialog } from "@/components/EditPecaDialog"

const PecaForm = ({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) => {
  const [pecaData, setPecaData] = useState<TablesInsert<"pecas">>({
    nome: "",
    valor_unitario: 0,
    estoque: 0,
  })

  const createPeca = useCreatePeca()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pecaData.nome || !pecaData.valor_unitario) {
      return
    }

    createPeca.mutate(pecaData, {
      onSuccess: () => {
        setPecaData({
          nome: "",
          valor_unitario: 0,
          estoque: 0,
        })
        onSuccess?.()
      }
    })
  }

  const handleCancel = () => {
    setPecaData({
      nome: "",
      valor_unitario: 0,
      estoque: 0,
    })
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="nome">Nome da Peça</Label>
        <Input 
          id="nome" 
          placeholder="Nome da peça" 
          value={pecaData.nome}
          onChange={(e) => setPecaData(prev => ({ ...prev, nome: e.target.value }))} 
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valor_unitario">Valor Unitário (R$)</Label>
          <Input 
            id="valor_unitario" 
            type="number"
            step="0.01"
            placeholder="0,00" 
            value={pecaData.valor_unitario || ""}
            onChange={(e) => setPecaData(prev => ({ ...prev, valor_unitario: parseFloat(e.target.value) || 0 }))} 
            required
          />
        </div>
        <div>
          <Label htmlFor="estoque">Estoque</Label>
          <Input 
            id="estoque" 
            type="number"
            placeholder="0" 
            value={pecaData.estoque || ""}
            onChange={(e) => setPecaData(prev => ({ ...prev, estoque: parseInt(e.target.value) || 0 }))} 
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90"
          disabled={createPeca.isPending}
        >
          {createPeca.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  )
}

const Pecas = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPeca, setEditingPeca] = useState<any>(null)

  const { data: pecas = [], isLoading } = usePecas()
  const deletePeca = useDeletePeca()

  const filteredPecas = pecas.filter(peca => 
    peca.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta peça?")) {
      deletePeca.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setIsDialogOpen(false)
  }

  const handleFormCancel = () => {
    setIsDialogOpen(false)
  }

  const handleEdit = (peca: any) => {
    setEditingPeca(peca)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando peças...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Peças</h1>
          <p className="text-muted-foreground">Gerencie seu estoque de peças</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Peça
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Peça</DialogTitle>
            </DialogHeader>
            <PecaForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
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
                  placeholder="Buscar por nome da peça..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Peças */}
      <div className="grid gap-6">
        {filteredPecas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Nenhuma peça encontrada com os filtros aplicados." 
                  : "Nenhuma peça cadastrada ainda."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPecas.map((peca) => (
            <Card key={peca.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{peca.nome}</CardTitle>
                      <Badge variant={peca.estoque && peca.estoque > 0 ? "default" : "destructive"}>
                        <Package className="w-3 h-3 mr-1" />
                        Estoque: {peca.estoque || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                      <DollarSign className="w-5 h-5" />
                      R$ {peca.valor_unitario.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(peca)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(peca.id)}
                      disabled={deletePeca.isPending}
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

      {editingPeca && (
        <EditPecaDialog
          peca={editingPeca}
          open={!!editingPeca}
          onOpenChange={(open) => !open && setEditingPeca(null)}
        />
      )}
    </div>
  )
}

export default Pecas
