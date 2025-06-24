const express = require('express');
const axios = require('axios');
const router = express.Router();
const cors = require('cors');

router.get('/', async (req, res) => {
  const { no_ente } = req.query;

  if (!no_ente) {
    return res.status(400).json({ error: "Parâmetro 'no_ente' é obrigatório." });
  }

  try {
      const response = await axios.get('https://apicadprev.trabalho.gov.br/v1/DAIR_APLICACOES_RESGATE', {
      params: { no_ente }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar API CADPREV." });
  }
});

module.exports = router;
