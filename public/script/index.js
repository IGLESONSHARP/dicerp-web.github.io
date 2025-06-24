const info = document.getElementById('info');
const mapa = document.getElementById('mapa');
const tooltip = document.getElementById('tooltip');

mapa.addEventListener('load', () => {
  const svgDoc = mapa.contentDocument;
  const svgRoot = svgDoc.documentElement;

  if (!svgDoc) {
    console.error("Erro ao acessar o conteúdo do SVG. Pode ser um problema de CORS.");
    return;
  }

  const municipios = svgDoc.querySelectorAll('.municipio');

  municipios.forEach(m => {
    const nomeMunicipio = m.id.replace(/_/g, ' ');

    m.style.fill = '#1B5E20';
    m.style.cursor = 'pointer';

    m.addEventListener('mouseenter', () => {
      tooltip.textContent = nomeMunicipio;
      tooltip.style.display = 'block';
      m.style.fill = '#66BB6A';
    });

    m.addEventListener('mousemove', (evt) => {
      // Pega posição relativa ao SVG
      const pt = svgRoot.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;

      const cursorpt = pt.matrixTransform(svgRoot.getScreenCTM().inverse());

      // Posição absoluta com base no evento (fora do <object>)
      const rect = mapa.getBoundingClientRect();

      tooltip.style.left = `${evt.clientX}px`;
      tooltip.style.top = `${evt.clientY - 15}px`;
    });

    m.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
      if (!m.classList.contains('selecionado')) {
        m.style.fill = '#1B5E20';
      }
    });

    m.addEventListener('click', () => {
      municipios.forEach(el => {
        el.classList.remove('selecionado');
        el.style.fill = '#1B5E20';
      });

      m.classList.add('selecionado');
      m.style.fill = '#FFD700';
      info.textContent = 'Você clicou em: ' + nomeMunicipio;
    });
  });
});

document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('home'));
                this.classList.add('home');
            });
        });

        // Adicionar animação ao balão de fala
        setTimeout(() => {
            const bubble = document.querySelector('.speech-bubble');
            bubble.style.animation = 'pulse 2s ease-in-out infinite';
        }, 1000);

        // CSS para animação do balão
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);


