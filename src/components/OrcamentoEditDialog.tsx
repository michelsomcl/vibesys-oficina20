
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OrcamentoForm } from "@/components/OrcamentoForm"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OrcamentoEditDialogProps {
  orcamento: any
  isOpen: boolean
  onClose: () => void
}

export const OrcamentoEditDialog = ({ orcamento, isOpen, onClose }: OrcamentoEditDialogProps) => {
  if (!orcamento) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Editar Orçamento - {orcamento.numero}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] px-6 pb-6">
          <OrcamentoForm 
            orcamento={orcamento} 
            onSuccess={onClose}
            onCancel={onClose}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
