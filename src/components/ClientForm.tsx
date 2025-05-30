
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCreateCliente } from "@/hooks/useClientes"
import { TablesInsert } from "@/integrations/supabase/types"

interface ClientFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const ClientForm = ({ onSuccess, onCancel }: ClientFormProps) => {
  const [clienteData, setClienteData] = useState<TablesInsert<"clientes">>({
    tipo: "PF",
    nome: "",
    documento: "",
    telefone: "",
    endereco: "",
    aniversario: "",
    marca: "",
    modelo: "",
    ano: "",
    placa: "",
    quilometragem: "",
  })

  const createCliente = useCreateCliente()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!clienteData.nome || !clienteData.documento) {
      return
    }

    createCliente.mutate(clienteData, {
      onSuccess: () => {
        setClienteData({
          tipo: "PF",
          nome: "",
          documento: "",
          telefone: "",
          endereco: "",
          aniversario: "",
          marca: "",
          modelo: "",
          ano: "",
          placa: "",
          quilometragem: "",
        })
        onSuccess?.()
      }
    })
  }

  const handleCancel = () => {
    setClienteData({
      tipo: "PF",
      nome: "",
      documento: "",
      telefone: "",
      endereco: "",
      aniversario: "",
      marca: "",
      modelo: "",
      ano: "",
      placa: "",
      quilometragem: "",
    })
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="dados" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="veiculo">Veículo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dados" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select 
                value={clienteData.tipo} 
                onValueChange={(value: "PF" | "PJ") => setClienteData(prev => ({ ...prev, tipo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">Pessoa Física</SelectItem>
                  <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome" 
                placeholder="Nome completo" 
                value={clienteData.nome}
                onChange={(e) => setClienteData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documento">CPF/CNPJ</Label>
              <Input 
                id="documento" 
                placeholder="000.000.000-00" 
                value={clienteData.documento}
                onChange={(e) => setClienteData(prev => ({ ...prev, documento: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone" 
                placeholder="(11) 99999-9999" 
                value={clienteData.telefone}
                onChange={(e) => setClienteData(prev => ({ ...prev, telefone: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input 
              id="endereco" 
              placeholder="Endereço completo" 
              value={clienteData.endereco}
              onChange={(e) => setClienteData(prev => ({ ...prev, endereco: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="aniversario">Data de Aniversário</Label>
            <Input 
              id="aniversario" 
              placeholder="DD/MM" 
              value={clienteData.aniversario}
              onChange={(e) => setClienteData(prev => ({ ...prev, aniversario: e.target.value }))}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="veiculo" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input 
                id="marca" 
                placeholder="Ex: Honda" 
                value={clienteData.marca}
                onChange={(e) => setClienteData(prev => ({ ...prev, marca: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input 
                id="modelo" 
                placeholder="Ex: Civic" 
                value={clienteData.modelo}
                onChange={(e) => setClienteData(prev => ({ ...prev, modelo: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ano">Ano</Label>
              <Input 
                id="ano" 
                placeholder="2020" 
                value={clienteData.ano}
                onChange={(e) => setClienteData(prev => ({ ...prev, ano: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="placa">Placa</Label>
              <Input 
                id="placa" 
                placeholder="ABC-1234" 
                value={clienteData.placa}
                onChange={(e) => setClienteData(prev => ({ ...prev, placa: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="quilometragem">Quilometragem</Label>
              <Input 
                id="quilometragem" 
                placeholder="50000" 
                value={clienteData.quilometragem}
                onChange={(e) => setClienteData(prev => ({ ...prev, quilometragem: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90"
          disabled={createCliente.isPending}
        >
          {createCliente.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  )
}
