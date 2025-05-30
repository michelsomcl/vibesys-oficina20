
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateServico } from "@/hooks/useServicos"
import { Tables } from "@/integrations/supabase/types"

interface EditServicoDialogProps {
  servico: Tables<"servicos">
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditServicoDialog = ({ servico, open, onOpenChange }: EditServicoDialogProps) => {
  const [formData, setFormData] = useState({
    nome: servico.nome,
    valor_hora: servico.valor_hora.toString(),
  })

  const updateServico = useUpdateServico()

  // Reset form data when servico changes
  useEffect(() => {
    setFormData({
      nome: servico.nome,
      valor_hora: servico.valor_hora.toString(),
    })
  }, [servico])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.valor_hora) {
      return
    }

    updateServico.mutate(
      { 
        id: servico.id, 
        nome: formData.nome,
        valor_hora: parseFloat(formData.valor_hora)
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
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nome">Nome do Serviço</Label>
            <Input 
              id="nome" 
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="valor_hora">Valor Por Serviço</Label>
            <Input 
              id="valor_hora" 
              type="number"
              step="0.01"
              value={formData.valor_hora}
              onChange={(e) => setFormData(prev => ({ ...prev, valor_hora: e.target.value }))}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={updateServico.isPending}
            >
              {updateServico.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
