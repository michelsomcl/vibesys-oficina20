
export const generateOrcamentoPrintContent = (orcamento: any, getVeiculoInfo: (orcamento: any) => string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Orçamento ${orcamento.numero}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .info { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
          .total { text-align: right; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ORÇAMENTO</h1>
          <h2>${orcamento.numero}</h2>
        </div>
        
        <div class="info">
          <p><strong>Cliente:</strong> ${orcamento.cliente?.nome}</p>
          ${orcamento.cliente?.telefone ? `<p><strong>Telefone:</strong> ${orcamento.cliente.telefone}</p>` : ''}
          <p><strong>Veículo:</strong> ${getVeiculoInfo(orcamento)}</p>
          ${orcamento.km_atual ? `<p><strong>Km Atual:</strong> ${orcamento.km_atual}</p>` : ''}
          <p><strong>Data:</strong> ${new Date(orcamento.data_orcamento).toLocaleDateString('pt-BR')}</p>
          <p><strong>Validade:</strong> ${new Date(orcamento.validade).toLocaleDateString('pt-BR')}</p>
          <p><strong>Status:</strong> ${orcamento.status}</p>
        </div>

        ${orcamento.orcamento_pecas?.length > 0 ? `
          <h3>PEÇAS</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qtd</th>
                <th>Valor Unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orcamento.orcamento_pecas.map(item => `
                <tr>
                  <td>${item.peca?.nome}</td>
                  <td>${item.quantidade}</td>
                  <td>R$ ${parseFloat(item.valor_unitario.toString()).toFixed(2).replace('.', ',')}</td>
                  <td>R$ ${(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2).replace('.', ',')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        ${orcamento.orcamento_servicos?.length > 0 ? `
          <h3>SERVIÇOS</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Qtd</th>
                <th>Valor Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orcamento.orcamento_servicos.map(item => `
                <tr>
                  <td>${item.servico?.nome}</td>
                  <td>${item.horas}</td>
                  <td>R$ ${parseFloat(item.valor_hora.toString()).toFixed(2).replace('.', ',')}</td>
                  <td>R$ ${(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2).replace('.', ',')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        <div class="total">
          <p>VALOR TOTAL: R$ ${orcamento.valor_total.toFixed(2).replace('.', ',')}</p>
        </div>
      </body>
    </html>
  `
}

export const printOrcamento = (orcamento: any, getVeiculoInfo: (orcamento: any) => string) => {
  const printContent = generateOrcamentoPrintContent(orcamento, getVeiculoInfo)
  
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}
