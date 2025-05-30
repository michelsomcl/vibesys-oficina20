
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface OrdemServicoCreateDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const OrdemServicoCreateDialog = ({ isOpen, onOpenChange }: OrdemServicoCreateDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova OS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Nova Ordem de Serviço</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <p className="text-center text-muted-foreground">
            Para criar uma nova Ordem de Serviço, primeiro é necessário ter um orçamento aprovado.
            Vá para a tela de Orçamentos, aprove um orçamento e ele aparecerá automaticamente aqui.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
