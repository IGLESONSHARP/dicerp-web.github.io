
const municipioscall = [
  "Governo do Estado do Amazonas", "Barcelos", "Barreirinha", "Benjamin constant", "Beruri",
"Borba", "Caapiranga", "Canutama", "Carauari", "Coari", "Envira", "Fonte boa",
"Humaitá", "Iranduba", "Itacoatiara", "Lábrea", "Manacapuru", "Manaquiri",
"Manaus", "Manicoré", "Maraã", "Maués", "Nhamundá", "Presidente figueiredo",
"Rio Preto da Eva", "Tabatinga", "Urucará"

];

const municipios2 = {
    amazonprev: 'GOVERNO DO ESTADO DO AMAZONAS',
    barcelos: 'BARCELOS',
    barreirinha: 'BARREIRINHA',
    benjconstant: 'BENJAMIN CONSTANT',
    beruri: 'BERURI',
    borba: 'BORBA',
    caapiranga: 'CAAPIRANGA',
    canutama: 'CANUTAMA',
    carauari: 'CARAUARI',
    coari: 'COARI',
    envira: 'ENVIRA',
    fonteboa: 'FONTE BOA',
    humaita: 'HUMAITÁ',
    iranduba: 'IRANDUBA',
    itacoatiara: 'ITACOATIARA',
    labrea: 'LÁBREA',
    manacapuru: 'MANACAPURU',
    manaquiri: 'MANAQUIRI',
    manaus: 'MANAUS',
    manicore: 'MANICORÉ',
    maraa: 'MARAÃ',
    maues: 'MAUÉS',
    nhamunda: 'NHAMUNDÁ',
    presfigueiredo: 'PRESIDENTE FIGUEIREDO',
    riopretodaeva: 'RIO PRETO DA EVA',
    tabatinga: 'TABATINGA',
    urucara: 'URUCARÁ'
  };

  const municipios3 = {
    amazonprevr: 'GOVERNO DO ESTADO DO AMAZONAS',
    barcelosr: 'BARCELOS',
    barreirinhar: 'BARREIRINHA',
    benjconstantr: 'BENJAMIN CONSTANT',
    berurir: 'BERURI',
    borbar: 'BORBA',
    caapirangar: 'CAAPIRANGA',
    canutamar: 'CANUTAMA',
    carauarir: 'CARAUARI',
    coarir: 'COARI',
    envirar: 'ENVIRA',
    fonteboar: 'FONTE BOA',
    humaitar: 'HUMAITÁ',
    irandubar: 'IRANDUBA',
    itacoatiarar: 'ITACOATIARA',
    labrear: 'LÁBREA',
    manacapurur: 'MANACAPURU',
    manaquirir: 'MANAQUIRI',
    manausr: 'MANAUS',
    manicorer: 'MANICORÉ',
    maraar: 'MARAÃ',
    mauesr: 'MAUÉS',
    nhamundar: 'NHAMUNDÁ',
    presfigueiredor: 'PRESIDENTE FIGUEIREDO',
    riopretodaevar: 'RIO PRETO DA EVA',
    tabatingar: 'TABATINGA',
    urucarar: 'URUCARÁ'
  };


document.getElementById('form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const sg_uf = 'AM';
  const dt_mes = document.getElementById('dt_mes').value.trim();
  const dt_ano = document.getElementById('dt_ano').value.trim();
  const resultado = document.getElementById('resultado');


  const baseUrl = `http://localhost:3000/proxy/relatoriomensal?sg_uf=${encodeURIComponent(sg_uf)}&dt_mes=${encodeURIComponent(dt_mes)}&dt_ano=${encodeURIComponent(dt_ano)}`;
  const url = `${baseUrl}`;

  console.log("url front final:", url);


  try {
    console.log("Consultando URL: ", url);
    const response = await fetch(url);

    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Resposta inválida ou não-JSON:", text);
      resultado.innerHTML = `Erro do servidor (status ${response.status}): A resposta não é um JSON válido.`;
      return;
    }

    const data = await response.json();
    /*console.log("DATA:", data); mostra todas os vetores da API conforme o que foi buscado no html*/
    const resultadoData = data?.results?.[0]?.data;
    console.log("vetores:", resultadoData);
    const quant = Array.isArray(resultadoData) ? resultadoData.length : 0; /*quantidade de vetores encontrados na API*/
    console.log("quantidade vetores encontrados:", quant);

    if (!Array.isArray(resultadoData)) {
      console.warn("Dados inválidos ou não encontrados.");
      return;
    }
/*tabela aplicações*/
    // Agrupador de soma por no_ente
    const somaPorEnte = {};

    for (const item of resultadoData) {
      const nome = item?.no_ente?.trim();
      const valor = parseFloat(item?.vl_operacao) || 0;
      const temQuantidade = item?.vl_quantidade_apos !== undefined && item.vl_quantidade_apos !== null;

      // Se for negativo e tem quantidade, é resgate → não soma
      if (valor < 0 && temQuantidade) {
        continue;
      }

      if (nome) {
        if (!somaPorEnte[nome]) {
          somaPorEnte[nome] = 0;
        }
        somaPorEnte[nome] += valor;
      }
    }

    // Exibir resultados
    console.log("Soma das aplicações por município (ignorando aplicações):");

    for (const [id, nome] of Object.entries(municipios2)) {
      const chaveNormalizada = normalizarNome(nome);

      // Encontrar o nome correspondente na somaPorEnte (API)
      const municipioCorrespondente = Object.keys(somaPorEnte).find(key =>
        normalizarNome(key) === chaveNormalizada
      );

      // Se não encontrado, considera 0
      const total = municipioCorrespondente ? somaPorEnte[municipioCorrespondente] : 0;

      const div = document.getElementById(id);
      if (div) {
        div.innerHTML = `${nome} <span style="margin-left: 20px;">${abreviarValor(total)}</span>`;
      }

      const el = document.getElementById(`valor-aplicacao-${id}`);
      if (el) {
        el.textContent = abreviarValor(total);
      }

      console.log(`${nome}: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    }
/*tabela resgates*/
    const somaResgatesPorEnte = {};

  for (const item of resultadoData) {
    const nome = item?.no_ente?.trim();
    const valor = parseFloat(item?.vl_operacao) || 0;
    const temQuantidadeApos = item?.quantidade_apos !== undefined && item.quantidade_apos !== null;

    // Considera apenas RESGATES (valor negativo E tem quantidade_apos)
    if (valor < 0 && temQuantidadeApos && nome) {
      if (!somaResgatesPorEnte[nome]) {
        somaResgatesPorEnte[nome] = 0;
      }
      somaResgatesPorEnte[nome] += valor;
    }
  }


    console.log("Soma dos resgates por município (ignorando aplicacões):");

    for (const [id, nome] of Object.entries(municipios3)) {
      const chaveNormalizada = normalizarNome(nome);

      const municipioCorrespondente = Object.keys(somaResgatesPorEnte).find(key =>
        normalizarNome(key) === chaveNormalizada
      );

      const total = municipioCorrespondente ? somaResgatesPorEnte[municipioCorrespondente] : 0;

      const div = document.getElementById(id);
      if (div) {
        div.innerHTML = `${nome} <span style="margin-left: 20px;">${abreviarValor(Math.abs(total))}</span>`;
      }

      const el = document.getElementById(`valor-resgate-${id}`);
      if (el) {
        el.textContent = abreviarValor(Math.abs(total));
      }

      console.log(`${nome} (resgate): ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    }



    /*const primeirotem = resultadoData[0];
    const valoroperacao = primeirotem.vl_operacao
    ? Number(primeirotem.vl_operacao).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    : '-'; primeiro vetor com o parametros em reais de valor de oepração*/
    if (Array.isArray(resultadoData) && resultadoData.length > 0) {
      const valor_aplicacao = resultadoData[16];

      const valor_aplicacao_reais = valor_aplicacao.vl_operacao
        ? Number(valor_aplicacao.vl_operacao).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        : 'N/A';

      const spanAmazonprev = document.getElementById('valor-aplicacao-amazonprev');
      if (spanAmazonprev) {
        spanAmazonprev.textContent = valor_aplicacao_reais; // Corrigido aqui
      }
    }

  } catch (err) {
    console.error('Erro:', err);
    resultado.textContent = 'Erro ao consultar dados.';
  }
});

/*tabela aplicação e resgates*/




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
const cores = municipios.map((_, i) => ` hsl(${i * 13}, 70%, 50%)`);
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

document.getElementById('table-data').addEventListener('submit', async function(e) {
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

function normalizarNome(str) {
  return str
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "") // remove restos dos acentos
    .replace(/\s+/g, '') // remove espaços
    .toUpperCase(); // padroniza em caixa alta
}

function abreviarValor(valor) {
  const absValor = Math.abs(valor);
  let abreviado = '';

  if (absValor >= 1_000_000_000) {
    abreviado = (valor / 1_000_000_000).toFixed(2).replace('.', ',') + 'B';
  } else if (absValor >= 1_000_000) {
    abreviado = (valor / 1_000_000).toFixed(2).replace('.', ',') + 'M';
  } else if (absValor >= 1_000) {
    abreviado = (valor / 1_000).toFixed(2).replace('.', ',') + 'K';
  } else {
    abreviado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return abreviado; // não adiciona "R$" de novo abaixo
  }

  return `R$ ${abreviado}`;
}
