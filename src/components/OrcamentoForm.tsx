
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useClientes } from "@/hooks/useClientes"
import { useCreateOrcamento, useUpdateOrcamento } from "@/hooks/useOrcamentos"
import { useCreateOrcamentoPeca } from "@/hooks/useOrcamentoPecas"
import { useCreateOrcamentoServico } from "@/hooks/useOrcamentoServicos"
import { Form } from "@/components/ui/form"
import { OrcamentoPecasList } from "@/components/OrcamentoPecasList"
import { OrcamentoServicosList } from "@/components/OrcamentoServicosList"
import { OrcamentoClienteSection } from "@/components/orcamento/OrcamentoClienteSection"
import { OrcamentoDateSection } from "@/components/orcamento/OrcamentoDateSection"
import { differenceInDays, parseISO } from "date-fns"
import { toast } from "sonner"

const orcamentoSchema = z.object({
  cliente_id: z.string().min(1, "Cliente é obrigatório"),
  veiculo_info: z.string().optional(),
  km_atual: z.string().optional(),
  data_orcamento: z.string().min(1, "Data do orçamento é obrigatória"),
  validade: z.string().min(1, "Validade é obrigatória"),
})

type OrcamentoFormData = z.infer<typeof orcamentoSchema>

interface OrcamentoFormProps {
  orcamento?: any
  onSuccess?: () => void
  onCancel?: () => void
}

interface LocalPeca {
  id: string
  peca_id: string
  peca_nome: string
  quantidade: number
  valor_unitario: number
}

interface LocalServico {
  id: string
  servico_id: string
  servico_nome: string
  horas: number
  valor_hora: number
}

export const OrcamentoForm = ({ orcamento, onSuccess, onCancel }: OrcamentoFormProps) => {
  const [selectedClienteId, setSelectedClienteId] = useState(orcamento?.cliente_id || "")
  const [selectedCliente, setSelectedCliente] = useState<any>(null)
  const [localPecas, setLocalPecas] = useState<LocalPeca[]>([])
  const [localServicos, setLocalServicos] = useState<LocalServico[]>([])
  
  const { data: clientes = [] } = useClientes()
  
  const createOrcamento = useCreateOrcamento()
  const updateOrcamento = useUpdateOrcamento()
  const createOrcamentoPeca = useCreateOrcamentoPeca()
  const createOrcamentoServico = useCreateOrcamentoServico()

  const form = useForm<OrcamentoFormData>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: {
      cliente_id: orcamento?.cliente_id || "",
      veiculo_info: "",
      km_atual: orcamento?.km_atual || "",
      data_orcamento: orcamento?.data_orcamento || new Date().toISOString().split('T')[0],
      validade: orcamento?.validade || "",
    },
  })

  // Update selected client information
  useEffect(() => {
    if (selectedClienteId) {
      const cliente = clientes.find(c => c.id === selectedClienteId)
      setSelectedCliente(cliente)
      
      if (cliente && cliente.marca && cliente.modelo) {
        const veiculoInfo = `${cliente.marca} ${cliente.modelo} ${cliente.ano} - ${cliente.placa}`
        form.setValue("veiculo_info", veiculoInfo)
      } else {
        form.setValue("veiculo_info", "")
      }
    } else {
      setSelectedCliente(null)
      form.setValue("veiculo_info", "")
    }
  }, [selectedClienteId, clientes, form])

  // Load existing budget data
  useEffect(() => {
    if (orcamento) {
      console.log("Loading budget:", orcamento)
      setSelectedClienteId(orcamento.cliente_id)
      
      if (orcamento.cliente) {
        const cliente = orcamento.cliente
        if (cliente.marca && cliente.modelo) {
          const veiculoInfo = `${cliente.marca} ${cliente.modelo} ${cliente.ano} - ${cliente.placa}`
          form.setValue("veiculo_info", veiculoInfo)
        }
      }
    }
  }, [orcamento, form])

  const salvarPecasEServicos = async (orcamentoId: string) => {
    console.log("Saving parts and services for budget:", orcamentoId)
    console.log("Local parts:", localPecas)
    console.log("Local services:", localServicos)

    // Save parts
    for (const peca of localPecas) {
      try {
        console.log("Saving part:", peca)
        await createOrcamentoPeca.mutateAsync({
          orcamento_id: orcamentoId,
          peca_id: peca.peca_id,
          quantidade: peca.quantidade,
          valor_unitario: peca.valor_unitario,
        })
        console.log("Part saved successfully")
      } catch (error) {
        console.error("Error saving part:", error)
        throw error
      }
    }

    // Save services
    for (const servico of localServicos) {
      try {
        console.log("Saving service:", servico)
        await createOrcamentoServico.mutateAsync({
          orcamento_id: orcamentoId,
          servico_id: servico.servico_id,
          horas: servico.horas,
          valor_hora: servico.valor_hora,
        })
        console.log("Service saved successfully")
      } catch (error) {
        console.error("Error saving service:", error)
        throw error
      }
    }
  }

  const onSubmit = async (data: OrcamentoFormData) => {
    try {
      console.log("Form data:", data)
      console.log("Selected client:", selectedCliente)
      console.log("Local parts to save:", localPecas)
      console.log("Local services to save:", localServicos)
      
      if (orcamento) {
        await updateOrcamento.mutateAsync({
          id: orcamento.id,
          cliente_id: data.cliente_id,
          veiculo_id: null,
          km_atual: data.km_atual,
          data_orcamento: data.data_orcamento,
          validade: data.validade,
        })
      } else {
        // Create new budget
        const novoOrcamento = await createOrcamento.mutateAsync({
          cliente_id: data.cliente_id,
          veiculo_id: null,
          km_atual: data.km_atual,
          data_orcamento: data.data_orcamento,
          validade: data.validade,
          numero: "",
          valor_total: 0,
          status: "Pendente",
        })

        console.log("Budget created:", novoOrcamento)

        // Save parts and services if any
        if (localPecas.length > 0 || localServicos.length > 0) {
          console.log("Starting save of parts and services...")
          await salvarPecasEServicos(novoOrcamento.id)
          
          if (localPecas.length > 0 && localServicos.length > 0) {
            toast.success("Budget created with parts and services!")
          } else if (localPecas.length > 0) {
            toast.success("Budget created with parts!")
          } else {
            toast.success("Budget created with services!")
          }
        }
      }
      onSuccess?.()
    } catch (error) {
      console.error("Error saving budget:", error)
      toast.error("Error saving budget. Please check the data and try again.")
    }
  }

  const handleClienteChange = (clienteId: string) => {
    setSelectedClienteId(clienteId)
    form.setValue("cliente_id", clienteId)
  }

  const hasVeiculoInfo = selectedCliente && selectedCliente.marca && selectedCliente.modelo

  // Calculate validity days
  const validadeDias = form.watch("validade") && form.watch("data_orcamento") 
    ? differenceInDays(parseISO(form.watch("validade")), parseISO(form.watch("data_orcamento")))
    : 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <OrcamentoClienteSection
          form={form}
          onClienteChange={handleClienteChange}
          hasVeiculoInfo={hasVeiculoInfo}
        />

        <OrcamentoDateSection
          form={form}
          validadeDias={validadeDias}
        />

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OrcamentoPecasList 
            orcamentoId={orcamento?.id}
            localPecas={localPecas}
            setLocalPecas={setLocalPecas}
          />
          
          <OrcamentoServicosList 
            orcamentoId={orcamento?.id}
            localServicos={localServicos}
            setLocalServicos={setLocalServicos}
          />
        </div>

        <div className="flex gap-4 pt-6">
          <Button type="submit" className="flex-1">
            {orcamento ? "Atualizar Orçamento" : "Criar Orçamento"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
