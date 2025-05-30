
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateFuncionario } from "@/hooks/useFuncionarios"
import { Tables } from "@/integrations/supabase/types"

interface EditFuncionarioDialogProps {
  funcionario: Tables<"funcionarios">
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditFuncionarioDialog = ({ funcionario, open, onOpenChange }: EditFuncionarioDialogProps) => {
  const [formData, setFormData] = useState({
    nome: funcionario.nome,
    documento: funcionario.documento,
    categoria: funcionario.categoria,
    telefone: funcionario.telefone || "",
    endereco: funcionario.endereco || "",
  })

  const updateFuncionario = useUpdateFuncionario()

  // Reset form data when funcionario changes
  useEffect(() => {
    setFormData({
      nome: funcionario.nome,
      documento: funcionario.documento,
      categoria: funcionario.categoria,
      telefone: funcionario.telefone || "",
      endereco: funcionario.endereco || "",
    })
  }, [funcionario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.documento) {
      return
    }

    updateFuncionario.mutate(
      { id: funcionario.id, ...formData },
      {
        onSuccess: () => {
          onOpenChange(false)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Funcionário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome" 
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="documento">Documento</Label>
              <Input 
                id="documento" 
                value={formData.documento}
                onChange={(e) => setFormData(prev => ({ ...prev, documento: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mecânico">Mecânico</SelectItem>
                  <SelectItem value="Pintor">Pintor</SelectItem>
                  <SelectItem value="Eletricista">Eletricista</SelectItem>
                  <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                  <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                  <SelectItem value="Proprietario">Proprietário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone" 
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input 
              id="endereco" 
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={updateFuncionario.isPending}
            >
              {updateFuncionario.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
