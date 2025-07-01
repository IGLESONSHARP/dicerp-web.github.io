/*API Servidor*/

document.querySelector('#form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const resultado = document.querySelector('#resultado');
  
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
    const baseUrl = `http://localhost:3000/proxy/aplicacoes/relatoriomensal`;
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
