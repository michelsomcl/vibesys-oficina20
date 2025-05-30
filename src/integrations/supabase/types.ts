export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          aniversario: string | null
          ano: string | null
          created_at: string
          documento: string
          endereco: string | null
          id: string
          marca: string | null
          modelo: string | null
          nome: string
          placa: string | null
          quilometragem: string | null
          telefone: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          aniversario?: string | null
          ano?: string | null
          created_at?: string
          documento: string
          endereco?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          nome: string
          placa?: string | null
          quilometragem?: string | null
          telefone?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          aniversario?: string | null
          ano?: string | null
          created_at?: string
          documento?: string
          endereco?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          nome?: string
          placa?: string | null
          quilometragem?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      contas_gerais: {
        Row: {
          created_at: string
          data_pagamento: string | null
          descricao: string
          id: string
          numero: string
          status: Database["public"]["Enums"]["status_conta"]
          tipo: Database["public"]["Enums"]["tipo_conta_geral"]
          updated_at: string
          valor: number
          vencimento: string
        }
        Insert: {
          created_at?: string
          data_pagamento?: string | null
          descricao: string
          id?: string
          numero: string
          status?: Database["public"]["Enums"]["status_conta"]
          tipo: Database["public"]["Enums"]["tipo_conta_geral"]
          updated_at?: string
          valor: number
          vencimento: string
        }
        Update: {
          created_at?: string
          data_pagamento?: string | null
          descricao?: string
          id?: string
          numero?: string
          status?: Database["public"]["Enums"]["status_conta"]
          tipo?: Database["public"]["Enums"]["tipo_conta_geral"]
          updated_at?: string
          valor?: number
          vencimento?: string
        }
        Relationships: []
      }
      contas_receber: {
        Row: {
          cliente_id: string
          created_at: string
          data_recebimento: string | null
          forma_pagamento: Database["public"]["Enums"]["forma_pagamento"] | null
          id: string
          numero: string
          orcamento_id: string | null
          status: Database["public"]["Enums"]["status_conta"]
          updated_at: string
          valor: number
          vencimento: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_recebimento?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          id?: string
          numero: string
          orcamento_id?: string | null
          status?: Database["public"]["Enums"]["status_conta"]
          updated_at?: string
          valor: number
          vencimento: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_recebimento?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          id?: string
          numero?: string
          orcamento_id?: string | null
          status?: Database["public"]["Enums"]["status_conta"]
          updated_at?: string
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_receber_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          cnpj: string
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cnpj: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      funcionarios: {
        Row: {
          categoria: Database["public"]["Enums"]["categoria_funcionario"]
          comissao_lavagem: number | null
          comissao_pecas: number | null
          comissao_servicos_externos: number | null
          comissao_servicos_internos: number | null
          created_at: string
          documento: string
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          categoria: Database["public"]["Enums"]["categoria_funcionario"]
          comissao_lavagem?: number | null
          comissao_pecas?: number | null
          comissao_servicos_externos?: number | null
          comissao_servicos_internos?: number | null
          created_at?: string
          documento: string
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          categoria?: Database["public"]["Enums"]["categoria_funcionario"]
          comissao_lavagem?: number | null
          comissao_pecas?: number | null
          comissao_servicos_externos?: number | null
          comissao_servicos_internos?: number | null
          created_at?: string
          documento?: string
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orcamento_pecas: {
        Row: {
          created_at: string
          id: string
          orcamento_id: string
          peca_id: string
          quantidade: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string
          id?: string
          orcamento_id: string
          peca_id: string
          quantidade: number
          valor_unitario: number
        }
        Update: {
          created_at?: string
          id?: string
          orcamento_id?: string
          peca_id?: string
          quantidade?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_pecas_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_pecas_peca_id_fkey"
            columns: ["peca_id"]
            isOneToOne: false
            referencedRelation: "pecas"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamento_servicos: {
        Row: {
          created_at: string
          horas: number
          id: string
          orcamento_id: string
          servico_id: string
          valor_hora: number
        }
        Insert: {
          created_at?: string
          horas: number
          id?: string
          orcamento_id: string
          servico_id: string
          valor_hora: number
        }
        Update: {
          created_at?: string
          horas?: number
          id?: string
          orcamento_id?: string
          servico_id?: string
          valor_hora?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_servicos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_servicos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          cliente_id: string
          created_at: string
          data_orcamento: string
          id: string
          km_atual: string | null
          numero: string
          status: Database["public"]["Enums"]["status_orcamento"]
          updated_at: string
          validade: string
          valor_total: number
          veiculo_id: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_orcamento: string
          id?: string
          km_atual?: string | null
          numero: string
          status?: Database["public"]["Enums"]["status_orcamento"]
          updated_at?: string
          validade: string
          valor_total?: number
          veiculo_id?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_orcamento?: string
          id?: string
          km_atual?: string | null
          numero?: string
          status?: Database["public"]["Enums"]["status_orcamento"]
          updated_at?: string
          validade?: string
          valor_total?: number
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      ordem_servico: {
        Row: {
          cliente_id: string
          created_at: string
          data_inicio: string
          desconto: number | null
          forma_pagamento: string | null
          id: string
          km_atual: string | null
          numero: string
          observacao: string | null
          orcamento_id: string | null
          prazo_conclusao: string
          status_pagamento: Database["public"]["Enums"]["status_pagamento"]
          status_servico: Database["public"]["Enums"]["status_servico"]
          updated_at: string
          valor_a_pagar: number | null
          valor_pago: number
          valor_total: number
          veiculo_id: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_inicio?: string
          desconto?: number | null
          forma_pagamento?: string | null
          id?: string
          km_atual?: string | null
          numero: string
          observacao?: string | null
          orcamento_id?: string | null
          prazo_conclusao: string
          status_pagamento?: Database["public"]["Enums"]["status_pagamento"]
          status_servico?: Database["public"]["Enums"]["status_servico"]
          updated_at?: string
          valor_a_pagar?: number | null
          valor_pago?: number
          valor_total?: number
          veiculo_id?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_inicio?: string
          desconto?: number | null
          forma_pagamento?: string | null
          id?: string
          km_atual?: string | null
          numero?: string
          observacao?: string | null
          orcamento_id?: string | null
          prazo_conclusao?: string
          status_pagamento?: Database["public"]["Enums"]["status_pagamento"]
          status_servico?: Database["public"]["Enums"]["status_servico"]
          updated_at?: string
          valor_a_pagar?: number | null
          valor_pago?: number
          valor_total?: number
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordem_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordem_servico_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordem_servico_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      pecas: {
        Row: {
          created_at: string
          estoque: number | null
          id: string
          nome: string
          updated_at: string
          valor_unitario: number
        }
        Insert: {
          created_at?: string
          estoque?: number | null
          id?: string
          nome: string
          updated_at?: string
          valor_unitario: number
        }
        Update: {
          created_at?: string
          estoque?: number | null
          id?: string
          nome?: string
          updated_at?: string
          valor_unitario?: number
        }
        Relationships: []
      }
      servicos: {
        Row: {
          created_at: string
          id: string
          nome: string
          updated_at: string
          valor_hora: number
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
          valor_hora: number
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
          valor_hora?: number
        }
        Relationships: []
      }
      veiculos: {
        Row: {
          ano: string
          cliente_id: string
          created_at: string
          id: string
          km: string | null
          marca: string
          modelo: string
          placa: string
          updated_at: string
        }
        Insert: {
          ano: string
          cliente_id: string
          created_at?: string
          id?: string
          km?: string | null
          marca: string
          modelo: string
          placa: string
          updated_at?: string
        }
        Update: {
          ano?: string
          cliente_id?: string
          created_at?: string
          id?: string
          km?: string | null
          marca?: string
          modelo?: string
          placa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_conta_geral_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_conta_receber_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_orcamento_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_os_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      categoria_funcionario:
        | "Mecânico"
        | "Pintor"
        | "Lavador"
        | "Recepcionista"
        | "Proprietario"
        | "Eletricista"
      forma_pagamento: "PIX" | "Cartão" | "Dinheiro" | "Transferência"
      status_conta: "Pendente" | "Pago" | "Recebido" | "Atrasado" | "Cancelado"
      status_orcamento: "Pendente" | "Aprovado" | "Reprovado" | "Cancelado"
      status_pagamento: "Pendente" | "Pago"
      status_servico:
        | "Andamento"
        | "Aguardando Peças"
        | "Finalizado"
        | "Entregue"
      tipo_conta_geral: "Fixa" | "Variável"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      categoria_funcionario: [
        "Mecânico",
        "Pintor",
        "Lavador",
        "Recepcionista",
        "Proprietario",
        "Eletricista",
      ],
      forma_pagamento: ["PIX", "Cartão", "Dinheiro", "Transferência"],
      status_conta: ["Pendente", "Pago", "Recebido", "Atrasado", "Cancelado"],
      status_orcamento: ["Pendente", "Aprovado", "Reprovado", "Cancelado"],
      status_pagamento: ["Pendente", "Pago"],
      status_servico: [
        "Andamento",
        "Aguardando Peças",
        "Finalizado",
        "Entregue",
      ],
      tipo_conta_geral: ["Fixa", "Variável"],
    },
  },
} as const
