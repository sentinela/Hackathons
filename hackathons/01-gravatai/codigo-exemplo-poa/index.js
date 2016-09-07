const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/orgaos', (req, res) => {

  // A URL que vamos capturar é a página de órgãos da prefeitura de Porto Alegre
  const url = 'http://portaltransparencia.procempa.com.br/portalTransparencia/despPorOrgaoPesquisa.do?viaMenu=true';

  // O primeiro parametro para a função request é a nossa url
  // O segundo é uma função que será executada quando o request acabar.
  // E leva 3 parametros, erro, código de status da response e o html da página
  request(url, (erro, response, html) => {

    // Primeiro verificamos se durante o request houve erro, se não, continuaremos (mr obvious)
    if (!erro) {

      // Usaremos a biblioteca cheerio para navegar entre os elementos do site com mais facilidade
      // Ela funciona 'igualzinho' o jQuery, toca ficha!
      const $ = cheerio.load(html);

      // cortaremos as primeiras 7 linhas de resultado por não serem dados válidos
      const orgaos = $('#idStrutsFormName table tr').toArray().slice(7)
        .map(orgao => ({
          codigo: $(orgao).find('td').eq(0).text(),
          nome: $(orgao).find('td').eq(1).text(),
          inicial: $(orgao).find('td').eq(2).text(),
          atualizado: $(orgao).find('td').eq(3).text()
          // poderiamos ter capturado as demais informacoes da tabela, basta navegar no DOM e encontrar as posicoes.
        }))
        .filter(orgao => orgao.inicial !== '' && orgao.inicial.indexOf('\n') < 0);

       // tadãm!
       console.log('orgaos', orgaos);
    }
  });
});

app.listen('8081')
console.log('Acesse localhost:8081/orgaos para rodar sua captura!');
exports = module.exports = app;
