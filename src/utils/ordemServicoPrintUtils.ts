
import { OrdemServicoWithDetails } from "@/hooks/useOrdensServico"

export const generateOrdemServicoPrintContent = (ordemServico: OrdemServicoWithDetails) => {
  const valorComDesconto = ordemServico.valor_total - (ordemServico.desconto || 0)
  const valorAPagarPrint = valorComDesconto - ordemServico.valor_pago
  
  // Get vehicle info from veiculo table or cliente table
  const getVeiculoInfo = () => {
    if (ordemServico.veiculo) {
      return {
        marca: ordemServico.veiculo.marca,
        modelo: ordemServico.veiculo.modelo,
        ano: ordemServico.veiculo.ano,
        placa: ordemServico.veiculo.placa
      }
    }
    
    if (ordemServico.cliente && ordemServico.cliente.marca && ordemServico.cliente.modelo) {
      return {
        marca: ordemServico.cliente.marca,
        modelo: ordemServico.cliente.modelo,
        ano: ordemServico.cliente.ano,
        placa: ordemServico.cliente.placa
      }
    }
    
    return {
      marca: 'N/A',
      modelo: 'N/A',
      ano: 'N/A',
      placa: 'N/A'
    }
  }

  const veiculoInfo = getVeiculoInfo()
  
  return `
    <html>
      <head>
        <title>OS ${ordemServico.numero}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin: 5px 0; }
          .label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ORDEM DE SERVIÇO</h1>
          <h2>OS ${ordemServico.numero}</h2>
        </div>
        
        <div class="section">
          <h3>Dados do Cliente</h3>
          <div class="row"><span class="label">Nome:</span> ${ordemServico.cliente?.nome}</div>
          <div class="row"><span class="label">Documento:</span> ${ordemServico.cliente?.documento}</div>
          <div class="row"><span class="label">Telefone:</span> ${ordemServico.cliente?.telefone || 'N/A'}</div>
        </div>

        <div class="section">
          <h3>Dados do Veículo</h3>
          <div class="row"><span class="label">Veículo:</span> ${veiculoInfo.marca} ${veiculoInfo.modelo} ${veiculoInfo.ano}</div>
          <div class="row"><span class="label">Placa:</span> ${veiculoInfo.placa}</div>
          <div class="row"><span class="label">Km Atual:</span> ${ordemServico.km_atual || 'N/A'}</div>
        </div>

        <div class="section">
          <h3>Serviços</h3>
          <table>
            <tr><th>Serviço</th><th>Qtd</th><th>Valor Unitário</th><th>Total</th></tr>
            ${ordemServico.orcamento?.orcamento_servicos?.map(item => `
              <tr>
                <td>${item.servico?.nome}</td>
                <td>${item.horas}</td>
                <td>R$ ${item.valor_hora.toFixed(2).replace('.', ',')}</td>
                <td>R$ ${(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2).replace('.', ',')}</td>
              </tr>
            `).join('') || '<tr><td colspan="4">Nenhum serviço</td></tr>'}
          </table>
        </div>

        <div class="section">
          <h3>Peças</h3>
          <table>
            <tr><th>Peça</th><th>Qtd</th><th>Valor Unitário</th><th>Total</th></tr>
            ${ordemServico.orcamento?.orcamento_pecas?.map(item => `
              <tr>
                <td>${item.peca?.nome}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${item.valor_unitario.toFixed(2).replace('.', ',')}</td>
                <td>R$ ${(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2).replace('.', ',')}</td>
              </tr>
            `).join('') || '<tr><td colspan="4">Nenhuma peça</td></tr>'}
          </table>
        </div>

        <div class="section">
          <h3>Resumo Financeiro</h3>
          <div class="row"><span class="label">Valor Total:</span> R$ ${ordemServico.valor_total.toFixed(2).replace('.', ',')}</div>
          <div class="row"><span class="label">Desconto:</span> R$ ${(ordemServico.desconto || 0).toFixed(2).replace('.', ',')}</div>
          <div class="row"><span class="label">Valor Pago:</span> R$ ${ordemServico.valor_pago.toFixed(2).replace('.', ',')}</div>
          <div class="row"><span class="label">Valor a Pagar:</span> R$ ${valorAPagarPrint.toFixed(2).replace('.', ',')}</div>
          <div class="row"><span class="label">Forma de Pagamento:</span> ${ordemServico.forma_pagamento || 'N/A'}</div>
          <div class="row"><span class="label">Status:</span> ${ordemServico.status_servico}</div>
        </div>

        ${ordemServico.observacao ? `
        <div class="section">
          <h3>Observações</h3>
          <p>${ordemServico.observacao}</p>
        </div>
        ` : ''}
      </body>
    </html>
  `
}

export const printOrdemServico = (ordemServico: OrdemServicoWithDetails) => {
  const printContent = generateOrdemServicoPrintContent(ordemServico)
  
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }
}
