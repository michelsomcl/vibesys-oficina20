
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdatePeca } from "@/hooks/usePecas"
import { Tables } from "@/integrations/supabase/types"

interface EditPecaDialogProps {
  peca: Tables<"pecas">
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditPecaDialog = ({ peca, open, onOpenChange }: EditPecaDialogProps) => {
  const [formData, setFormData] = useState({
    nome: peca.nome,
    valor_unitario: peca.valor_unitario.toString(),
    estoque: peca.estoque?.toString() || "0",
  })

  const updatePeca = useUpdatePeca()

  // Reset form data when peca changes
  useEffect(() => {
    setFormData({
      nome: peca.nome,
      valor_unitario: peca.valor_unitario.toString(),
      estoque: peca.estoque?.toString() || "0",
    })
  }, [peca])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.valor_unitario) {
      return
    }

    updatePeca.mutate(
      { 
        id: peca.id, 
        nome: formData.nome,
        valor_unitario: parseFloat(formData.valor_unitario),
        estoque: parseInt(formData.estoque) || 0
      },
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
          <DialogTitle>Editar Peça</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nome">Nome da Peça</Label>
            <Input 
              id="nome" 
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_unitario">Valor Unitário</Label>
              <Input 
                id="valor_unitario" 
                type="number"
                step="0.01"
                value={formData.valor_unitario}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_unitario: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="estoque">Estoque</Label>
              <Input 
                id="estoque" 
                type="number"
                value={formData.estoque}
                onChange={(e) => setFormData(prev => ({ ...prev, estoque: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={updatePeca.isPending}
            >
              {updatePeca.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
