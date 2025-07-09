
const municipioscall = [
  "AMAZONPREV", "BARCELOS", "BARREIRINHA", "BENJAMIN CONSTANT", "BERURI",
  "BORBA", "CAAPIRANGA", "CANUTAMA", "CARAUARI", "COARI", "ENVIRA", "FONTE BOA",
  "HUMAITÁ", "IRANDUBA", "ITACOATIARA", "LÁBREA", "MANACAPURU", "MANAQUIRI",
  "MANAUS", "MANICORÉ", "MARAÃ", "MAUÉS", "NHAMUNDÁ", "PRES. FIGUEIREDO",
  "RIO PRETO DA EVA", "TABATINGA", "URUCARÁ"
];

const municipios2 = {
    amazonprev: 'AMAZONPREV',
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
    presfigueiredo: 'PRES. FIGUEIREDO',
    riopretodaeva: 'RIO PRETO DA EVA',
    tabatinga: 'TABATINGA',
    urucara: 'URUCARÁ'
  };

  const municipios3 = {
    amazonprevr: 'AMAZONPREV',
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
    presfigueiredor: 'PRES. FIGUEIREDO',
    riopretodaevar: 'RIO PRETO DA EVA',
    tabatingar: 'TABATINGA',
    urucarar: 'URUCARÁ'
  };
const valor= 12335;

document.getElementById('table-data').addEventListener('submit', async function (e) {
  e.preventDefault();

  const dt_mes = document.getElementById('dt_mes').value.trim();
  const dt_ano = document.getElementById('dt_ano').value.trim();

  const resultado = document.querySelector('#resultado');
  
  resultado.innerHTML = 'Carregando...';
  tabela.innerHTML = '';
  if (cnpjDiv) cnpjDiv.innerHTML = '';

  if (!no_ente) {
    resultado.innerHTML = '';
    return;
  }



  const sg_uf = 'AM';


  

  for (const [id, nome] of Object.entries(municipios2)) {
    const div = document.getElementById(id);
    if (div) {
      div.innerHTML = `${nome} <span style="margin-left: 40px;">${valor}</span>`;
      const el = document.getElementById(`valor-aplicacao-${municipios2}`);
      if (el) el.textContent = valor;
    }
  }
  for (const [id, nome] of Object.entries(municipios3)) {
    const div = document.getElementById(id);
    if (div) {
      div.innerHTML = `${nome} <span style="margin-left: 40px;">${valor}</span>`;
      const el = document.getElementById(`valor-resgate-${municipios3}`);
      if (el) el.textContent = valor;
    }
  }


  if(!resultado)
  {
    console.error("Elemento com id 'resultado' não foi encontrado no DOM.");
    return;
  }


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
    const url = `${baseUrl}?${params.toString()}`;

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