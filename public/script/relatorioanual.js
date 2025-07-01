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
        // Gráfico de barras 1
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

        // Gráfico de barras 2
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