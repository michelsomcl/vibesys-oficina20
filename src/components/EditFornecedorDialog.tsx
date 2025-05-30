
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateFornecedor } from "@/hooks/useFornecedores"
import { Tables } from "@/integrations/supabase/types"

interface EditFornecedorDialogProps {
  fornecedor: Tables<"fornecedores">
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditFornecedorDialog = ({ fornecedor, open, onOpenChange }: EditFornecedorDialogProps) => {
  const [formData, setFormData] = useState({
    nome: fornecedor.nome,
    cnpj: fornecedor.cnpj,
    telefone: fornecedor.telefone || "",
    email: fornecedor.email || "",
    endereco: fornecedor.endereco || "",
  })

  const updateFornecedor = useUpdateFornecedor()

  // Reset form data when fornecedor changes
  useEffect(() => {
    setFormData({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      telefone: fornecedor.telefone || "",
      email: fornecedor.email || "",
      endereco: fornecedor.endereco || "",
    })
  }, [fornecedor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.cnpj) {
      return
    }

    updateFornecedor.mutate(
      { id: fornecedor.id, ...formData },
      {
        onSuccess: () => {
          onOpenChange(false)
        }
      }
    )
  }

  const handleCancel = () => {
    setFormData({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      telefone: fornecedor.telefone || "",
      email: fornecedor.email || "",
      endereco: fornecedor.endereco || "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Fornecedor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome da Empresa</Label>
              <Input 
                id="nome" 
                placeholder="Nome do fornecedor" 
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input 
                id="cnpj" 
                placeholder="00.000.000/0000-00" 
                value={formData.cnpj}
                onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
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
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="contato@fornecedor.com" 
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input 
              id="endereco" 
              placeholder="Endereço completo" 
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={updateFornecedor.isPending}
            >
              {updateFornecedor.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
