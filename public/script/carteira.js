
document.getElementById('form1').addEventListener('submit', async function(e) {
  e.preventDefault(); // Evita o envio tradicional do formulário

  const no_ente = document.getElementById('no_ente').value.trim();
  const dt_mes_bimestre = document.getElementById('dt_mes_bimestre').value.trim();
  const dt_ano = document.getElementById('dt_ano').value.trim();
  
  if (!no_ente) {
    alert('Por favor, selecione um município.');
    return;
  }

  let url = `http://localhost:3000/proxy/aplicacoes?no_ente=${encodeURIComponent(no_ente)}`;
  if (dt_mes_bimestre) url += `&dt_mes_bimestre=${encodeURIComponent(dt_mes_bimestre)}`;
  if (dt_ano) url += `&dt_ano=${encodeURIComponent(dt_ano)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Aqui você pode exibir os dados em tabela, console, ou exportar
    console.log('Dados recebidos:', data);

    // Exemplo simples de exibição:
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro ao consultar os dados. Verifique o console.');
  }

  /*html js*/
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
    let url = `http://localhost:3000/proxy/carteira?sg_uf=${encodeURIComponent(sg_uf)}&no_ente=${encodeURIComponent(no_ente)}`;
    if (dt_mes_bimestre) url += `&dt_mes_bimestre=${encodeURIComponent(dt_mes_bimestre)}`;
    if (dt_ano) url += `&dt_ano=${encodeURIComponent(dt_ano)}`;

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
                            <div class="column-header" ></div>
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
        const mes = item.dt_mes_bimestre
          ? numeroParaMes(item.dt_mes_bimestre)
            : 'N/A';
        const ano = item.dt_ano || '-';
        const valor_ativo_atual = item.vl_atual_ativo
        ? Number(item.vl_atual_ativo).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })
          : '-';
        const valor_ativo_total = item.vl_total_atual
        ? Number(item.vl_atual_total).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })
          : '-';
        if (valor_ativo_atual == NaN)
        {
          console.log("valor vazios");
        }
        const patrimonio = item.vl_patrimonio
        ? Number(item.vl_patrimonio).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }) 
        : '-';

        const row = document.createElement('div');
        row.classList.add('table-columns');
        row.innerHTML = `
          <div></div> <!-- coluna vazia -->
          <div class="column-header">${fundo}</div>
          <div class="column-header">${mes}</div>
          <div class="column-header">${ano}</div>
          <div class="column-header">${valor_ativo_atual}</div>
          <div class="column-header">${valor_ativo_total}</div>
          <div class="column-header">${patrimonio}</div>
          
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

