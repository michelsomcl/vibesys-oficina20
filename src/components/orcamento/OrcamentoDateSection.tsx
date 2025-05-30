
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface OrcamentoDateSectionProps {
  form: any
  validadeDias: number
}

export const OrcamentoDateSection = ({ form, validadeDias }: OrcamentoDateSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="data_orcamento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data do Orçamento</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="validade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Validade {validadeDias > 0 && `(${validadeDias} dias)`}</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
