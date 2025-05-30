
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useClientes } from "@/hooks/useClientes"

interface OrcamentoClienteSectionProps {
  form: any
  onClienteChange: (clienteId: string) => void
  hasVeiculoInfo: boolean
}

export const OrcamentoClienteSection = ({ form, onClienteChange, hasVeiculoInfo }: OrcamentoClienteSectionProps) => {
  const { data: clientes = [] } = useClientes()

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cliente_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={onClienteChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="km_atual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>KM Atual</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 50000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {hasVeiculoInfo && (
        <FormField
          control={form.control}
          name="veiculo_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informações do Veículo</FormLabel>
              <FormControl>
                <Input {...field} readOnly className="bg-gray-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  )
}
