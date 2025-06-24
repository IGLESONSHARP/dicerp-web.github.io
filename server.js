const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota para consultar dados da API CADPREV com base no nome do ente
app.get('/proxy/aplicacoes', async (req, res) => {
  console.log('Query recebida(APLICAÇÕES): ', req.query);
  const { no_ente } = req.query;

  if (!no_ente) {
    return res.status(400).json({ error: `O parâmetro no_ente é obrigatório.`});
  }

  const url = `https://apicadprev.trabalho.gov.br/DAIR_APLICACOES_RESGATE?no_ente=${encodeURIComponent(no_ente)}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
  } catch (error) {
    console.error('Erro no proxy: ', error);
    res.status(500).json({ error: 'Erro interno no servidor proxy' });
  }
});

app.get('/proxy/carteira', async (req, res) => {
  console.log('Query recebida(CARTEIRA): ', req.query);
  const { no_ente } = req.query;

  if (!no_ente) {
    return res.status(400).json({ error: 'O parâmetro no_ente é obrigatório.' });
  }

  const url = `https://apicadprev.trabalho.gov.br/DAIR_CARTEIRA?no_ente=${encodeURIComponent(no_ente)}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
  } catch (error) {
    console.error('Erro no proxy: ', error);
    res.status(500).json({ error: 'Erro interno no servidor proxy' });
  }
})


app.get('/proxy/fundos', async (req, res) => {
  console.log('Query recebida(FUNDOS): ', req.query);
  const { no_ente } = req.query;

  if (!no_ente) {
    return res.status(400).json({ error: 'O parâmetro no_ente é obrigatório.' });
  }

  const url = `https://apicadprev.trabalho.gov.br/DAIR_FUNDO_INVEST_ANALISADOS?no_ente=${encodeURIComponent(no_ente)}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
  } catch (error) {
    console.error('Erro no proxy: ', error);
    res.status(500).json({ error: 'Erro interno no servidor proxy' });
  }})

app.get('/proxy/governanca', async (req, res) => {
  console.log('Query recebida(GOVERNANÇA): ', req.query);
  const { no_ente } = req.query;

  if (!no_ente) {
    return res.status(400).json({ error: 'O parâmetro no_ente é obrigatório.' });
  }

  const url = `https://apicadprev.trabalho.gov.br/DAIR_GOVERNANCA?no_ente=${encodeURIComponent(no_ente)}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
  } catch (error) {
    console.error('Erro no proxy: ', error);
    res.status(500).json({ error: 'Erro interno no servidor proxy' });
  }})
// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor Node.js rodando em http://localhost:${PORT}`);
});