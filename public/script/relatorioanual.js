/*API servidor*/

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


document.getElementById('form3').addEventListener('submit', async function (e) {
  e.preventDefault();

  const sg_uf = 'AM';
  const no_ente = document.getElementById('no_ente').value.trim();
  const dt_ano = document.getElementById('dt_ano').value.trim();
  const resultado = document.getElementById('resultado');


  const baseUrl = `http://localhost:3000/proxy/relatorioanual?sg_uf=${encodeURIComponent(sg_uf)}&no_ente=${encodeURIComponent(no_ente)}&dt_ano=${encodeURIComponent(dt_ano)}`;
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
    const municipiosA = [];
    const valoresAplicacoes =[];
    const coresAplicacoes = [];
    // Agrupador de soma por no_ente
    const somaTotalAplicacaoEnte = {};
    let totalAplicacoes = 0;
    let somatotal=0;

    for (const item of resultadoData) {
      const valor = parseFloat(item?.vl_operacao) || 0;
      const temQuantidade = parseFloat(item?.vl_quantidade_apos);

      if (temQuantidade > 0 ) {
        somatotal += valor;
        totalAplicacoes++;
      }
    }
      console.log("total", somatotal);

        console.log("ENTE", somaTotalAplicacaoEnte);
    
    document.getElementById('soma_aplicacoes').innerText=formatarParaReais(somatotal);

    // Exibir resultados
    console.log("Soma total das aplicações no ano por município (ignorando resgates):");

    for (const [id, nome] of Object.entries(municipios2)) {
      const chaveNormalizada = normalizarNome(nome);

      // Encontrar o nome correspondente na somaPorEnte (API)
      const municipioCorrespondente = Object.keys(somaTotalAplicacaoEnte).find(key =>
        normalizarNome(key) === chaveNormalizada
      );

      // Se não encontrado, considera 0
      const total = municipioCorrespondente ? somaTotalAplicacaoEnte[municipioCorrespondente] : 0;
      municipiosA.push(nome);
      valoresAplicacoes.push(total);
      coresAplicacoes.push(gerarCorAleatoria());

      const div = document.getElementById(id);
      if (div) {
        div.innerHTML = `${nome} <span style="margin-left: 10px; background-color: green">${abreviarValor(total)}</span>`;
      }

      const el = document.getElementById(`valor-aplicacao-${id}`);
      if (el) {
        el.textContent = abreviarValor(total);
      }

      console.log(`${nome}: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    }

/*tabela resgates*/
    const municipiosR = [];
    let totalResgates = 0;
    let somatotalResgates=0;
    const somarPorMes = {};

    for (const item of resultadoData) {
      const mes = parseFloat (item?.dt_mes);
      const valor = parseFloat(item?.vl_operacao) || 0;
      const temQuantidadeNega = parseFloat(item?.vl_quantidade_apos);
      console.log("meses", mes);
      if (temQuantidadeNega > 0 && data) {
        const mes = new Date(data).getMonth() + 1; // Mês de 1 a 12

        // Formata como "01", "02", ..., "12"
        const mesFormatado = mes.toString().padStart(2, '0');

        if (!somarPorMes[mesFormatado]) {
          somarPorMes[mesFormatado] = 0;
        }

        somarPorMes[mesFormatado] += valor;
        somatotalResgates += valor;
        totalResgates++;
      }
  }
    
      console.log("total", somatotalResgates);
    
    document.getElementById('soma_resgates').innerText=formatarParaReais(somatotalResgates);

    console.log("Soma total das resgates no ano por município (ignorando aplicacões)");

    for (const [id1, nome1] of Object.entries(municipios3)) {
      const chaveNormalizada = normalizarNome(nome1);

      const municipioCorrespondente = Object.keys(somaResgatesPorEnte).find(key =>
        normalizarNome(key) === chaveNormalizada
      );

      const total = municipioCorrespondente ? somaResgatesPorEnte[municipioCorrespondente] : 0;
      
      municipiosR.push(nome1);
      valoresResgates.push(total);
      coresResgates.push(gerarCorAleatoria());

      const div = document.getElementById(id1);
      if (div) {
        div.innerHTML = `${nome1} <span style="margin-left: 10px; background-color: green">${abreviarValor(Math.abs(total))}</span>`;
      }

      const el = document.getElementById(`valor-resgate-${id1}`);
      if (el) {
        el.textContent = abreviarValor(Math.abs(total));
      }

      console.log(`${nome1} (resgate): ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
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


/*graficos e analises*/
const monthlyData = {
  labels: ['Jan', 'Fev', 'Mar','Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  datasets: [
    {
      label: 'Série 1',
      data: [3000, 4500, 5200, 4800, 5500, 6200, 5800, 6800, 7200, 6500, 1100],
      borderColor: '#4a7c59',
      backgroundColor: 'rgba(74, 124, 89, 0.1)',
      tension: 0.4,
      fill: true
    },
    // ... outros datasets
  ]
};
Chart.defaults.color = '#ffffff';
        Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';

        // Gráfico de Operações Anuais (Donut)
        const operationsCtx = document.getElementById('operationsChart').getContext('2d');
        new Chart(operationsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Renda Fixa', 'Ações', 'Multimercado', 'Cambial'],
                datasets: [{
                    data: [40, 30, 13, 10],
                    backgroundColor: ['#4FC3F7', '#FFA726', '#66BB6A', '#EF5350'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '30%'
            }
            
        });
const meses = ['Jan', 'Fev', 'Mar','Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        // Gráfico de Resgate e Resgate (Pizza pequena)
        const rescueCtx = document.getElementById('rescueChart').getContext('2d');
        new Chart(rescueCtx, {
            type: 'pie',
            data: {
                labels: ['Resgate', 'Aplicação'],
                datasets: [{
                    data: [60, 40],
                    backgroundColor: ['#4FC3F7', '#66BB6A'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            },
            
        });
const cores = meses.map((_, i) => `hsl(${i * 13}, 70%, 50%)`);
        // Gráfico de barras 1 aplicacoes
        const barCtx1 = document.getElementById('barChart1').getContext('2d');
        new Chart(barCtx1, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    data: [1200000, 980000, 750000, 1200000, 980000, 750000,1200000, 980000, 750000, 1200000, 980000, 750000],
                    borderColor: '#4a7c59',
                    backgroundColor: cores,
                    borderRadius: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Operação (R$)'
                        },
                        grid: {
                            color: '#333)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000000).toFixed(1) + 'M';
                            }
                        },
                        
                    },
                    x: {
                        title: {
                        display: true,
                        text: 'meses'
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

        // Gráfico de barras 2 resgates
        const barCtx2 = document.getElementById('barChart2').getContext('2d');
        new Chart(barCtx2, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    data: [1800000, 1200000, 890000,1800000, 1200000, 890000,1800000, 1200000, 890000,1800000, 1200000, 890000,],
                    backgroundColor: cores,
                    borderRadius: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#333'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        // Adicionar interatividade aos itens da navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Adicionar funcionalidade aos filtros
        document.querySelectorAll('.filter-input').forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });

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

function gerarCorAleatoria() {
  const r = Math.floor(Math.random() * 156 + 100); // tons mais claros
  const g = Math.floor(Math.random() * 156 + 100);
  const b = Math.floor(Math.random() * 156 + 100);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
}
function formatarParaReais(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
