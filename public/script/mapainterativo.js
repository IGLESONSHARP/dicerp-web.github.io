
const info = document.getElementById('info');
const mapa = document.getElementById('mapa');
mapa.addEventListener('load', () => {

    const svgDoc=mapa.contentDocument;

    if (!svgDoc) {
      console.error("Erro ao acessar o conteúdo do SVG. Pode ser um problema de CORS. Use um servidor local.");
      return;
    }

    const municipios = svgDoc.querySelectorAll('.municipio');

    municipios.forEach(m => {
        m.style.fill ='#1B5E20';
        m.style.cursor='pointer';
        
      m.addEventListener('click', () => {
        const nome = m.id.replace(/_/g, ' ');
        info.textContent = 'Você clicou em: ' + nome;
        m.style.fill = '#FFD700';
      });
    });
});


