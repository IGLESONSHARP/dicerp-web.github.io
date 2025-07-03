// Adiciona os listeners nos campos
['no_ente', 'dt_mes', 'dt_ano'].forEach(id => {
  document.getElementById(id).addEventListener('change', buscarDados);
});

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await buscarDados();
});

// Função principal para buscar e exibir os dados
async function buscarDados() {
  const sg_uf = document.getElementById('sg_uf').value.trim();
  const no_ente = document.getElementById('no_ente').value.trim();
  const dt_mes = document.getElementById('dt_mes').value.trim();
  const dt_ano = document.getElementById('dt_ano').value.trim();
  const resultado = document.getElementById('resultado');
  const tabela = document.getElementById('table-rows');
  const cnpjDiv = document.getElementById('cnpj-container');

  resultado.innerHTML = 'Carregando...';
  tabela.innerHTML = '';
  if (cnpjDiv) cnpjDiv.innerHTML = '';

  if (!no_ente) {
    resultado.innerHTML = '';
    return;
  }
  
  try {
    const url = `http://localhost:3000/proxy/aplicacoes?no_ente=${encodeURIComponent(no_ente)}&dt_mes=${encodeURIComponent(dt_mes)}&dt_ano=${encodeURIComponent(dt_ano)}`;
    const response = await fetch(url);
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Resposta do servidor (não JSON):", text);
      resultado.innerHTML = 'A resposta do servidor não é um JSON válido.';
      return;
    }

    const data = await response.json();
    const resultadoData = data?.results?.[0]?.data;

    if (Array.isArray(resultadoData) && resultadoData.length > 0) {
      resultadoData.sort((a, b) => a.dt_ano - b.dt_ano);

      const primeiroItem = resultadoData[0];
      const estadoEntidade = getEstadoSigla(primeiroItem) || 'N/A';
      const cnpjEntidade = primeiroItem.nr_cnpj_entidade
        ? formatarCNPJ(primeiroItem.nr_cnpj_entidade)
        : 'N/A';

      if (cnpjDiv) {
        cnpjDiv.innerHTML = `
          <strong>CNPJ: ${cnpjEntidade}</strong>
          <strong>UF: ${estadoEntidade}</strong>
        `;
      }

      resultado.innerHTML = `Foram encontrados ${resultadoData.length} registros.`;

      const header = document.createElement('div');
      header.classList.add('table-row', 'table-header');
      header.innerHTML = `
        <div class="table-columns">
          <div></div>
          <div class="column-header">Fundo</div>
          <div class="column-header">Mês</div>
          <div class="column-header">Ano</div>
          <div class="column-header">Valor</div>
          <div class="column-header">Tipo Operação</div>
        </div>
      `;
      tabela.appendChild(header);

      resultadoData.forEach(item => {
        const fundo = item.ds_identificacao_ativo || '-';
        const mes = item.dt_mes ? numeroParaMes(item.dt_mes) : 'N/A';
        const ano = item.dt_ano || '-';
        const valor = item.vl_operacao
          ? Number(item.vl_operacao).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })
          : '-';
        const toperacao = item.tp_operacao || '-';

        const row = document.createElement('div');
        row.classList.add('table-columns');
        row.innerHTML = `
          <div></div>
          <div class="column-header">${fundo}</div>

          <div class="column-header">${valor}</div>
          <div class="column-header">${toperacao}</div>
        `;
        tabela.appendChild(row);
      });
    } else {
      resultado.innerHTML = 'Nenhum dado encontrado.';
    }
  } catch (error) {
    console.error("Erro ao consultar dados:", error);
    resultado.innerHTML = 'Erro ao consultar dados.';
  }
}
/*exportar excel*/
let resultadoData = []; // variável global para armazenar os dados

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const no_ente = document.getElementById('no_ente').value.trim();
  const dt_mes = document.getElementById('dt_mes').value.trim();
  const dt_ano = document.getElementById('dt_ano').value.trim();

  let url = `http://localhost:3000/proxy/aplicacoes?no_ente=${encodeURIComponent(no_ente)}`;
  if (dt_mes) url += `&dt_mes=${encodeURIComponent(dt_mes)}`;
  if (dt_ano) url += `&dt_ano=${encodeURIComponent(dt_ano)}`;

  const resultado = document.getElementById('resultado');
  resultado.innerHTML = 'Carregando...';

  try {
    const response = await fetch(url);
    const data = await response.json();
    resultadoData = data?.results?.[0]?.data || [];

    if (resultadoData.length > 0) {
      resultado.innerHTML = `Foram encontrados ${resultadoData.length} registros.`;
    } else {
      resultado.innerHTML = 'Nenhum dado encontrado.';
    }
  } catch (error) {
    resultado.innerHTML = 'Erro ao consultar dados.';
  }
});

document.getElementById('exportarExcel').addEventListener('click', () => {
  if (!resultadoData || resultadoData.length === 0) {
    alert("Nenhum dado para exportar.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(resultadoData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Aplicações");

  XLSX.writeFile(workbook, "dados_aplicacoes.xlsx");
});
