document.getElementById('form2').addEventListener('submit', async (e) => {
  e.preventDefault();
  const no_ente = document.getElementById('no_ente').value.trim();
  const resultado = document.getElementById('resultado');

  resultado.innerHTML = 'Carregando...';

  try {
    const url = `http://localhost:3000/proxy/fundos?no_ente=${encodeURIComponent(no_ente)}`;
    console.log("Consultando ente: ", no_ente);
    const response = await fetch(url);

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Resposta não é JSON:", text);
      resultado.innerHTML = 'A resposta do servidor não é um JSON válido.';
      return;
    }

    const data = await response.json();
    const resultadoData = data?.results?.[0]?.data;

    if (Array.isArray(resultadoData) && resultadoData.length > 0) {
      resultado.innerHTML = `<pre>${JSON.stringify(resultadoData, null, 2)}</pre>`;
    } else {
      resultado.innerHTML = 'Nenhum dado encontrado.';
    }
  } catch (error) {
    console.error("Erro ao consultar dados:", error);
    resultado.innerHTML = 'Erro ao consultar dados.';
  }
});

document.getElementById('no_ente').addEventListener('change', async (e) => {
  const no_ente = e.target.value;
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
    const url = `http://localhost:3000/proxy/fundos?no_ente=${encodeURIComponent(no_ente)}`;
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
      const segundoItem = resultadoData[1];

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
                            <div class="tooltip">
                                
                                <span class="tooltip-text"></span>
                            </div>
                        </div>
      `;
      tabela.appendChild(header);

      // ✅ Linhas da tabela
      resultadoData.forEach(item => {
        const fundo = item.no_fundo || '-';
        const cnpjFundo = item.nr_cnpj_fundo
          ? formatarCNPJ(item.nr_cnpj_fundo)
          : 'N/A';
        const mes = item.dt_mes
          ? numeroParaMes(item.dt_mes)
            : 'N/A';
        const ano = item.dt_ano || '-';
        

        const row = document.createElement('div');
        row.classList.add('table-columns');
        row.innerHTML = `
          <div></div> <!-- coluna vazia -->
          <div class="column-header">${fundo}</div>
          <div class="column-header">${cnpjFundo}</div>
          <div class="column-header">${mes}</div>
          <div class="column-header">${ano}</div>
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
});

/** Formata CNPJ */
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
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  if(numero >= 1 && numero <= 12)
  {
    return meses[numero - 1]
  }
  else{
    return "Mês inválido";
  }
}


// Exemplos:
console.log(extrairEstado("Prefeitura de Manaus - AM")); // "AM"
console.log(extrairEstado("Fundo Municipal de Saúde - SP")); // "SP"