// converte-amazonas.js
const fs = require('fs');
const d3 = require('d3-geo');
const topojson = require('topojson-client');

const geojson = JSON.parse(fs.readFileSync('amazonas.json'));
const projection = d3.geoMercator().fitSize([800,600], geojson);
const pathGen = d3.geoPath().projection(projection);

let svg = `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">`;

geojson.features.forEach(f => {
  const nome = f.properties.name;
  const d = pathGen(f);
  svg += `<path id="${nome.replace(/ /g,'_')}" class="municipio" d="${d}"/>`;
});

svg += `</svg>`;
fs.writeFileSync('amazonas.svg', svg);
