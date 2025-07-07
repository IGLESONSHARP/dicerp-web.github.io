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
  const {sg_uf= 'AM', no_ente, dt_mes, dt_ano } = req.query;
  

  console.log('SG_UF:', sg_uf, 'no_ente:', no_ente, '| dt_mes:', dt_mes, '| dt_ano', dt_ano);

  if (!no_ente) {
    return res.status(400).json({ error: `O parâmetro no_ente é obrigatório.`});
  }
  

  const baseUrl=`https://apicadprev.trabalho.gov.br/DAIR_APLICACOES_RESGATE`;
  const params = new URLSearchParams({sg_uf, no_ente});
  if (dt_mes) params.append('dt_mes', dt_mes);
  if (dt_ano) params.append('dt_ano', dt_ano);



  const url = `${baseUrl}?${params.toString()}`;
  console.log('URL Final', url);

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
  } catch (error) {

    if (error.response) {
      console.error('Erro resposta API externa:', error.response.data);
      res.status(error.response.status).json({

        error: 'Erro na API externa',
        detalhes: error.response.data
      });
      } else {
        console.error('Erro no proxy:', error.message);
        res.status(500).json({ error: 'Erro interno no servidor proxy' });
      }

  }
});

app.get('/proxy/carteira', async (req, res) => {
  console.log('Query recebida(CARTEIRA): ', req.query);
  const { sg_uf='AM', no_ente, dt_mes_bimestre, dt_ano } = req.query;

  console.log('sg_uf:', sg_uf, '|no_ente:', no_ente, '|dt_mes:', dt_mes_bimestre, '|dt_ano:', dt_ano);

  if (!no_ente) {
    return res.status(400).json({ error: 'O parâmetro no_ente é obrigatório.' });
  }

  
  const baseUrl='https://apicadprev.trabalho.gov.br/DAIR_CARTEIRA';
  const params = new URLSearchParams({sg_uf, no_ente});
  if (dt_mes_bimestre) params.append('dt_mes_bimestre', dt_mes_bimestre);
  if (dt_ano) params.append('dt_ano', dt_ano);

  const url = `${baseUrl}?${params.toString()}`;
  console.log('URL Final', url);


  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
  } catch (error) {

    if (error.response) {
      console.error('Erro resposta API externa:', error.response.data);
      res.status(error.response.status).json({

        error: 'Erro na API externa',
        detalhes: error.response.data
      });
      } else {
        console.error('Erro no proxy:', error.message);
        res.status(500).json({ error: 'Erro interno no servidor proxy' });
      }

  }
});

app.get('/proxy/fundos', async (req, res) => {
  console.log('Query recebida(FUNDOS): ', req.query);
  const { sg_uf='AM', no_ente, dt_mes, dt_ano } = req.query;

  console.log('sg_uf:', sg_uf, '|no_ente:', no_ente, '|dt_mes:', dt_mes, '|dt_ano:', dt_ano);

  if (!no_ente) {
    return res.status(400).json({ error: 'O parâmetro no_ente é obrigatório.' });
  }

  
  const baseUrl='https://apicadprev.trabalho.gov.br/DAIR_FUNDO_INVEST_ANALISADOS';
  const params = new URLSearchParams({sg_uf, no_ente});
  if (dt_mes) params.append('dt_mes', dt_mes);
  if (dt_ano) params.append('dt_ano', dt_ano);

  const url = `${baseUrl}?${params.toString()}`;
  console.log('URL Final', url);


  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
  } catch (error) {

    if (error.response) {
      console.error('Erro resposta API externa:', error.response.data);
      res.status(error.response.status).json({

        error: 'Erro na API externa',
        detalhes: error.response.data
      });
      } else {
        console.error('Erro no proxy:', error.message);
        res.status(500).json({ error: 'Erro interno no servidor proxy' });
      }

  }
});

app.get('/proxy/governanca', async (req, res) => {
  console.log('Query recebida(GOVERNANCA): ', req.query);
  const { sg_uf='AM', no_ente, dt_mes, dt_ano } = req.query;

  console.log('sg_uf:', sg_uf, '|no_ente:', no_ente, '|dt_mes:', dt_mes, '|dt_ano:', dt_ano);

  if (!no_ente) {
    return res.status(400).json({ error: 'O parâmetro no_ente é obrigatório.' });
  }

  
  const baseUrl='https://apicadprev.trabalho.gov.br/DAIR_FUNDO_INVEST_ANALISADOS';
  const params = new URLSearchParams({sg_uf, no_ente});
  if (dt_mes) params.append('dt_mes', dt_mes);
  if (dt_ano) params.append('dt_ano', dt_ano);

  const url = `${baseUrl}?${params.toString()}`;
  console.log('URL Final', url);


  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
  } catch (error) {

    if (error.response) {
      console.error('Erro resposta API externa:', error.response.data);
      res.status(error.response.status).json({

        error: 'Erro na API externa',
        detalhes: error.response.data
      });
      } else {
        console.error('Erro no proxy:', error.message);
        res.status(500).json({ error: 'Erro interno no servidor proxy' });
      }

  }
});


/*relatorio mensal(mes e ano)*/
app.get('/proxy/relatoriomensal', async (req, res) => {
  console.log('Query recebida(RELATÓRIO MENSAL): ', req.query);
  const { sg_uf='AM', dt_mes, dt_ano } = req.query;
  console.log('sg_uf:', sg_uf, '|dt_mes:', dt_mes, '|dt_ano:', dt_ano);


  if (!dt_mes || !dt_ano) {
    return res.status(400).json({ 
      error: `O parâmetro 'no_ente' e 'dt_ano' é obrigatório.`});
  }

  const baseUrl=`https://apicadprev.trabalho.gov.br/DAIR_APLICACOES_RESGATE`;
  const params = new URLSearchParams({sg_uf, dt_mes, dt_ano});


  const url =`${baseUrl}?${params.toString()}`;
  console.log('URL FINAL', url);
  try {
    const response = await axios.get(url);
    const dataprev=res.json(response.data);
    console.log(dataprev);
  } catch (error) {
    console.error('Erro no proxy: ', error.message);
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: 'Erro ao consultar a API externa.'
    });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor Node.js rodando em http://localhost:${PORT}`);
});