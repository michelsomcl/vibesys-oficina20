
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react"
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome da Peça</Label>
        <Input 
          id="nome" 
          placeholder="Digite o nome da peça" 
          value={pecaData.nome}
          onChange={(e) => setPecaData(prev => ({ ...prev, nome: e.target.value }))} 
          required
        />
      </div>
      
      <div>
        <Label htmlFor="valor_unitario">Valor Unitário</Label>
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
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPeca, setEditingPeca] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { data: pecas = [], isLoading } = usePecas()
  const deletePeca = useDeletePeca()

  const filteredPecas = pecas.filter(peca => 
    peca.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    deletePeca.mutate(id)
  }

  const handleFormSuccess = () => {
    setIsCreateDialogOpen(false)
  }

  const handleFormCancel = () => {
    setIsCreateDialogOpen(false)
  }

  const handleEdit = (peca: any) => {
    setEditingPeca(peca)
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Peças</h1>
          <p className="text-muted-foreground">
            Gerencie seu estoque de peças
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Peça
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Peça</DialogTitle>
            </DialogHeader>
            <PecaForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Peças</CardTitle>
          <CardDescription>
            Total de {filteredPecas.length} peça(s) cadastrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar peças..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor Unitário</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPecas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Nenhuma peça encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPecas.map((peca) => (
                    <TableRow key={peca.id}>
                      <TableCell className="font-medium">{peca.nome}</TableCell>
                      <TableCell>R$ {peca.valor_unitario.toFixed(2)}</TableCell>
                      <TableCell>{peca.estoque || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(peca)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a peça "{peca.nome}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(peca.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingPeca && (
        <EditPecaDialog
          peca={editingPeca}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open)
            if (!open) setEditingPeca(null)
          }}
        />
      )}
    </div>
  )
}

export default Pecas
