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
