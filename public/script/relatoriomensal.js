/*API Servidor*/
/*chamada somente municipios RPPS
const municipios = ['Barcelos', 'Barreirinha', 'Benjamin Constant', 'Beruri', 'Borba', 'Caapiranga',
  'Canutama', 'Carauari', 'Coari', 'Envira', 'Fonte Boa', 'Humaitá', 'Iranduba',
  'Itacoatiara', 'Lábrea', 'Manacapuru', 'Manaquiri', 'Manaus', 'Manicoré', 'Maraã',
  'Maués', 'Nnhamundá', 'Presidente Figueiredo', 'Rio Preto da Eva', 'Tabatinga', 'Urucará']*/
document.querySelector('#form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const resultado = document.querySelector('#resultado');
  const dt_mes = document.getElementById('dt_mes').value.trim();
  const dt_ano = document.getElementById('dt_ano').value.trim();
  const sg_uf = 'AM';
  
  if(!resultado)
  {
    console.error("Elemento com id 'resultado' não foi encontrado no DOM.");
    return;
  }

  const inputs = document.querySelectorAll('#form select');
  const params = new URLSearchParams();

  inputs.forEach(input =>{
    const nome = input.name;
    const valor = input.value.trim();
    if(nome && valor !== '')
    {
      params.append(nome, valor);
    }
  });

  resultado.innerHTML = 'Carregando...';

  try {
    const baseUrl = `http://localhost:3000/proxy/relatoriomensal?sg_uf=${encodeURIComponent(sg_uf)}&dt_mes=${encodeURIComponent(dt_mes)}&dt_ano=${encodeURIComponent(dt_ano)}`;
    const url =`${baseUrl}?${params.toString()}`;

    console.log("Consultando URL: ", url );
 
    const response = await fetch(url);

    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Resposta inválida ou não-JSON:", text);
      resultado.innerHTML = `Erro do servidor (status ${response.status}): A resposta não é um JSON válido.`;
      return;
    }

    const data = await response.json();
   
    if (data && Array.isArray(data.results) & data.results.length > 0) {
      resultado.innerHTML = `<pre>${JSON.stringify(data.results, null, 2)}</pre>`;
    } else {
      resultado.textContent = 'Nenhum dado encontrado para os paramentros informados.';
    }
  } catch (err) {
    console.error('Erro:', err);
    resultado.textContent = 'Erro ao consultar dados.';
  }
});




/*graficos e analises*/
const monthlyData = {
  labels: ['AMAZONPREV', 'BARCELOS', 'BARREIRINHA', 'BENJAMIN CONSTANT', 'BERURI', 'BORBA', 'CAAPIRANGA',
  'CANUTAMA', 'CARAURI', 'COARI', 'ENVIRA', 'FONTE BOA', 'HUMAITÁ', 'IRANDUBA',
  'ITACOATIARA', 'LÁBREA', 'MANACAPURU', 'MANAQUIRI', 'MANAUS', 'MANICORÉ', 'MARAÃ',
  'MAUÉS', 'NHAMUNDÁ', 'PRESIDENTE FIGUEIREDO', 'RIO PRETO DA EVA', 'TABATINGA', 'URUCARÁ'],
  datasets: [
    {
      label: 'Série 1',
      data: [3000, 4500, 5200, 4800, 5500, 6200, 5800, 6800, 7200, 6500],
      borderColor: '#4a7c59',
      backgroundColor: 'rgba(74, 124, 89, 0.1)',
      tension: 0.4,
      fill: true
    },
    // ... outros datasets
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true, max: 8000, ticks: { stepSize: 1000 } },
    x: { grid: { display: false } }
  }
};

const aplicacoesCtx = document.getElementById('aplicacoesChart').getContext('2d');
const resgatesCtx = document.getElementById('resgatesChart').getContext('2d');


const municipios = [
  'AMAZONPREV', 'BARCELOS', 'BARREIRINHA', 'BENJMANIN CONSTANT', 'BERURI', 'BORBA', 'CAAPIRANGA',
  'CANUTAMA', 'CARAURI', 'COARI', 'ENVIRA', 'FONTE BOA', 'HUMAITÁ', 'IRANDUBA',
  'ITACOATIARA', 'LÁBREA', 'MANACAPURU', 'MANAQUIRI', 'MANAUS', 'MANICORÉ', 'MARAÃ',
  'MAUÉS', 'NHAMUNDÁ', 'PRESIDENTE FIGUEIREDO', 'RIO PRETO DA EVA', 'TABATINGA', 'URUCARÁ'
];

// Exemplo: valores simulados aleatórios
const valores = municipios.map(() => Math.floor(Math.random() * 5000) + 1000);

// Cores diferentes para cada barra
const cores = municipios.map((_, i) => `hsl(${i * 13}, 70%, 50%)`);
/*aplicações*/
const aplicacoesChart = new Chart(aplicacoesCtx, {
  type: 'bar',
  data: {
    labels: municipios,
    datasets: [{
      label: 'VALORES EM REAIS',
      data: valores,
      backgroundColor: cores,
      borderColor: '#333',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Operação (R$)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Municípios'
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45
        }
      }
    },
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        mode: 'index'
      }
    }
  }
});

const redemptionsData = {
  ...monthlyData,
  datasets: monthlyData.datasets.map(ds => ({
    ...ds,
    data: ds.data.map(value => value * 0.8 + Math.random() * 500)
  }))
};
/*resgates*/
const resgatesChartChart = new Chart(resgatesCtx, {
  type: 'bar',
  data: {
    labels: municipios,
    datasets: [{
      label: 'VALORES EM REAIS',
      data: valores,
      backgroundColor: cores,
      borderColor: '#333',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Operação (R$)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Municípios'
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45
        }
      }
    },
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        mode: 'index'
      }
    }
  }
});

document.getElementById('form').addEventListener('submit', async function(e) {
  e.preventDefault();
   // Evita o envio tradicional do formulário
  const sg_uf = 'AM';
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

 
  let url = `http://localhost:3000/proxy/aplicacoes?sg_uf=${encodeURIComponent(sg_uf)}&no_ente=${encodeURIComponent(no_ente)}`;
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
                  
                            <div class="tooltip">
                                
                                <span class="tooltip-text"></span>
                            </div>
                        </div>
      `;
      tabela.appendChild(header);

      // ✅ Linhas da tabela
      resultadoData.forEach(item => {
        const identificacao_ativo = item.ds_identificacao_ativo || '-';
        /*const mes = item.dt_mes_bimestre
          ? numeroParaMes(item.dt_mes_bimestre)
            : 'N/A';
        const ano = item.dt_ano || '-';*/

        const segmento = item.no_segmento || '-';
        const tipooperacao = item.tp_operacao || '-';
        const operacao = item.vl_operacao
        ? Number(item.vl_operacao).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })
        : '-';

        const row = document.createElement('div');
        row.classList.add('table-columns');
        row.innerHTML = `
          <div></div> <!-- coluna vazia -->
          <div class="column-header">${identificacao_ativo}</div>
          <div class="column-header">${segmento}</div>
          <div class="column-header">${tipooperacao}</div>   
          <div class="column-header">${operacao}</div>        
        `;
        tabela.appendChild(row);
      });

    } else {
      resultado.innerHTML = 'Nenhum dado encontrado. API para consulta fora do AR!';
    }
  } catch (error) {
    console.error("Erro ao consultar dados:", error);
    resultado.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
});


/*exportar PDF*/
document.getElementById("btnExportar").addEventListener("click", async () => {
    const area = document.getElementById("area-pdf");
    const canvas = await html2canvas(area, { scale: 4 });
    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    pdf.save("dados_da_tela.pdf");
  });
/*FUNÇÕES PARA CONVESÃO DE DADOS NO FRONT, EXEMPLO: INTEIROS PARA REAIS (R$)*/
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