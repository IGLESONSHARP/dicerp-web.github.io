
document.getElementById('form4').addEventListener('submit', async function(e) {
  e.preventDefault();
   // Evita o envio tradicional do formulário
  const sg_uf = 'AM';
  const no_ente = document.getElementById('no_ente').value.trim();
  const dt_mes = document.getElementById('dt_mes').value.trim();
  const dt_ano = document.getElementById('dt_ano').value.trim();
  const resultado = document.getElementById('resultado');
  const tabela = document.getElementById('table-rows');
  const cnpjDiv = document.getElementById('cnpj-container');

  resultado.innerHTML = '<div></div> <!-- coluna vazia --> Carregando...';
  tabela.innerHTML = '';
  if (cnpjDiv) cnpjDiv.innerHTML = '';
  
  if (!no_ente) {
    resultado.innerHTML = '';
    return;
  }

 
  let url = `http://localhost:3000/proxy/governanca?sg_uf=${encodeURIComponent(sg_uf)}&no_ente=${encodeURIComponent(no_ente)}`;
  if (dt_mes) url += `&dt_mes=${encodeURIComponent(dt_mes)}`;
  if (dt_ano) url += `&dt_ano=${encodeURIComponent(dt_ano)}`;

  try {
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
      // ✅ Mostra o CNPJ da entidade uma vez
      const primeiroItem = resultadoData[0];
      const segundoItem = resultadoData[2];

      const estadoEntidade= getEstadoSigla(segundoItem) || 'N/A';

      const cnpjEntidade = primeiroItem.nr_cnpj_entidade
        ? formatarCNPJ(primeiroItem.nr_cnpj_entidade)
        : 'N/A';

      if (cnpjDiv) {
        cnpjDiv.innerHTML = `
          <strong><span class="main-content2"></span></strong>
          <strong>CNPJ: ${cnpjEntidade}
            <span class="main-content2"></span>
          </strong>
          <strong>UF: ${estadoEntidade}
            <span class="main-content2"></span>
          </strong>
        
        `;
      }

      resultado.innerHTML = `Foram encontrados ${resultadoData.length} registros.`;

      // ✅ Cabeçalho da tabela
      const header = document.createElement('div');
      header.classList.add('table-row', 'table-header');
      header.innerHTML = `
        <div class="table-columns">
                            <div></div>                            
                            <div class="column-header" ></div>
                            <div class="column-header"></div>
                            <div class="column-header"></div>
                            <div class="column-header"></div>
                            <div class="column-header" ></div>
                            <div class="tooltip">
                                
                                <span class="tooltip-text"></span>
                            </div>
                        </div>
      `;
      tabela.appendChild(header);

      // ✅ Linhas da tabela
      resultadoData.forEach(item => {
        const nome_servidor = item.no_pessoa || '-';
        const tipo_vinculo = item.tp_vinculo || '-';
        const no_atribuicao = item.no_atribuicao || '-';
        const no_orgao_entidade = item.no_orgao_entidade || '-';

        const row = document.createElement('div');
        row.classList.add('table-columns');
        row.innerHTML = `
          <div></div> <!-- coluna vazia -->
          <div class="column-header">${nome_servidor}</div>
          <div class="column-header">${tipo_vinculo}</div>
          <div class="column-header">${no_atribuicao}</div>
          <div class="column-header">${no_orgao_entidade}</div>
          <div class="sidebar-item with-tooltip">... 
          <span class="button-label">detalhes</span></div>
          
          
        `;
        tabela.appendChild(row);
      });

    } else {
      resultado.innerHTML = '<div></div> <!-- coluna vazia --> Nenhum dado encontrado. API para consulta fora do AR!';
    }
  } catch (error) {
    console.error("Erro ao consultar dados:", error);
    resultado.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
});

function formatarCNPJ(cnpj) {
  cnpj = cnpj.toString().padStart(14, '0'); // garante 14 dígitos
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function extrairEstado(str) {
  if (!str || typeof str !== 'string') return '';

  const partes = str.trim().split('-');
  if (partes.length > 1) {
    return partes[partes.length - 1].trim(); // Retorna o que vem após o hífen
  }
  return '';
}

function getEstadoSigla(obj)
{
  return obj?.sg_uf || '';
}

function numeroParaMes(numero)
{
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezemevro"];
  if(numero >= 1 && numero <= 12)
  {
    return meses[numero -1];
  } else {
    return "Mês Inválido";
  }
}