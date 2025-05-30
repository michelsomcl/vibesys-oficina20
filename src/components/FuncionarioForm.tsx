import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateFuncionario } from "@/hooks/useFuncionarios"
import { TablesInsert } from "@/integrations/supabase/types"

interface FuncionarioFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const FuncionarioForm = ({ onSuccess, onCancel }: FuncionarioFormProps) => {
  const [funcionarioData, setFuncionarioData] = useState<TablesInsert<"funcionarios">>({
    nome: "",
    categoria: "Mecânico",
    documento: "",
    telefone: "",
    endereco: "",
  })

  const createFuncionario = useCreateFuncionario()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!funcionarioData.nome || !funcionarioData.documento || !funcionarioData.categoria) {
      return
    }

    createFuncionario.mutate(funcionarioData, {
      onSuccess: () => {
        setFuncionarioData({
          nome: "",
          categoria: "Mecânico",
          documento: "",
          telefone: "",
          endereco: "",
        })
        onSuccess?.()
      }
    })
  }

  const handleCancel = () => {
    setFuncionarioData({
      nome: "",
      categoria: "Mecânico",
      documento: "",
      telefone: "",
      endereco: "",
    })
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome Completo</Label>
          <Input 
            id="nome" 
            placeholder="Nome do funcionário" 
            value={funcionarioData.nome}
            onChange={(e) => setFuncionarioData(prev => ({ ...prev, nome: e.target.value }))} 
            required
          />
        </div>
        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Select 
            value={funcionarioData.categoria} 
            onValueChange={(value: "Mecânico" | "Pintor" | "Lavador") => 
              setFuncionarioData(prev => ({ ...prev, categoria: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mecânico">Mecânico</SelectItem>
              <SelectItem value="Pintor">Pintor</SelectItem>
              <SelectItem value="Lavador">Lavador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="documento">CPF</Label>
          <Input 
            id="documento" 
            placeholder="000.000.000-00" 
            value={funcionarioData.documento}
            onChange={(e) => setFuncionarioData(prev => ({ ...prev, documento: e.target.value }))} 
            required
          />
        </div>
        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input 
            id="telefone" 
            placeholder="(11) 99999-9999" 
            value={funcionarioData.telefone}
            onChange={(e) => setFuncionarioData(prev => ({ ...prev, telefone: e.target.value }))} 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="endereco">Endereço</Label>
        <Input 
          id="endereco" 
          placeholder="Endereço completo" 
          value={funcionarioData.endereco}
          onChange={(e) => setFuncionarioData(prev => ({ ...prev, endereco: e.target.value }))} 
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90"
          disabled={createFuncionario.isPending}
        >
          {createFuncionario.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  )
}
