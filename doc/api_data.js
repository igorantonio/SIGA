define({ "api": [
  {
    "type": "get",
    "url": "/caixa",
    "title": "Index",
    "name": "IndexCaixa",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nivelAlerta",
            "description": "<p>(Query) Filtrar o resultado obtido por estado de alerta, nível 0 ou 1.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "withAlerta",
            "description": "<p>(Query) Filtrar o resultado para edificios com algum dos níveis de alerta. {'true'}</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "caixas",
            "description": "<p>Todas as caixas d'agua obtidas.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "get",
    "url": "/caixa/:caixa_id",
    "title": "Obter informações de um caixa",
    "name": "ShowCaixa",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador para a caixa.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "edificio",
            "description": "<p>informações sobre o edificio.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "post",
    "url": "/caixa/:caixa_id/vazamentos/new",
    "title": "Adicionar vazamento",
    "name": "createVazamentos",
    "group": "Caixa_Vazamentos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa de agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "data",
            "description": "<p>Data do vazamento.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "volume",
            "description": "<p>Volume do vazamento.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "vazamentos",
            "description": "<p>Vazamentos da caixa (incluindo novo vazamento).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa_Vazamentos"
  },
  {
    "type": "post",
    "url": "/caixa/",
    "title": "Criação de caixa de agua",
    "name": "createCaixa",
    "group": "Caixa",
    "description": "<p>Todos os parâmetros devem estar encapsulados em um json.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome para a caixa de agua (Obrigatório).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "10..",
            "optional": false,
            "field": "descricao",
            "defaultValue": "Nenhuma descrição informada",
            "description": "<p>Descrição para a caixa de agua (Obrigatório).</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "caracteristicasFisicas",
            "description": "<p>Caracteristicas fisicas da caixa de agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao",
            "description": "<p>Localização da caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao.setor",
            "description": "<p>Setor onde a caixa d'água está localizada.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao.bloco",
            "description": "<p>Bloco onde a caixa d'água está localizada.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.area",
            "description": "<p>Área ocupada pela caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_pavimentos",
            "description": "<p>Número de pavimentos da caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.ocupacaoMedia",
            "description": "<p>Ocupação Média da caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.volumeReservatorio",
            "description": "<p>Capacidade da caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "mediaEsperada",
            "description": "<p>Média de consumo esperada (No dia).</p>"
          },
          {
            "group": "Parameter",
            "type": "json[]",
            "optional": true,
            "field": "historicoConsumo",
            "description": "<p>Histórico de consumo da caixa. Exemplo de item:</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": true,
            "field": "historicoConsumo.0",
            "description": "<p>Exemplo de Item da lista. (Referente ao registro de consumo da caixa).</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "historicoConsumo.0.data",
            "description": "<p>Data do registro.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "historicoConsumo.0.consumo",
            "description": "<p>Volume consumido registrado.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "post",
    "url": "/caixa/:caixa_id/consumo/new",
    "title": "Adicionar consumo",
    "name": "createConsumo",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa de agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "data",
            "description": "<p>Data do registro. (Caso o consumo seja referente a varios dias, este é o ultimo dia).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "consumo",
            "description": "<p>Volume consumido registrado.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "qDias",
            "defaultValue": "1",
            "description": "<p>Quantidade de dias que o consumo é referente.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "consumos",
            "description": "<p>Consumos da caixa (após a adição do novo consumo).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "delete",
    "url": "/caixa/:caixa_id",
    "title": "Remover um edificio",
    "name": "deleteCaixa",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "message",
            "description": "<p>Mensagem informando que a caixa foi removida.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "delete",
    "url": "/caixa/:caixa_id/consumo/:consumo_id",
    "title": "Remover um consumo",
    "name": "deleteConsumo",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa de agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "consumo_id",
            "description": "<p>Identificador do consumo.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "consumos",
            "description": "<p>Consumos da caixa (após a exclusão do consumo).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "delete",
    "url": "/caixa/:caixa_id/vazamentos/:vazamento_id",
    "title": "Remover um vazamento",
    "name": "deleteVazamento",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa de agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vazamento_id",
            "description": "<p>Identificador do vazamento a ser removido.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "vazamentos",
            "description": "<p>Vazamentos da caixa (após a exclusão).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "get",
    "url": "/caixa/:caixa_id/consumo",
    "title": "Obter consumos",
    "name": "getConsumo",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa de agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "ano",
            "description": "<p>Filtrar para obter apenas consumos de um determinado ano.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "mes",
            "description": "<p>Filtrar para obter apenas consumos de um determinado mês.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "dia",
            "description": "<p>Filtrar para obter apenas consumos de um determinado dia.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "inicio",
            "description": "<p>Filtrar para obter apenas consumos a partir de uma certa data (inicio). A String deve seguir o padrão de representação de data javascript.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "fim",
            "description": "<p>Filtrar para obter apenas consumos até uma certa data (fim). A String deve seguir o padrão de representação de data javascript.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "granularidade",
            "defaultValue": "day",
            "description": "<p>Definir agrupamento dos consumos. valores permitidos: {'anual','mensal','diario',detalhado}.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "consumos",
            "description": "<p>Consumos da caixa (respeitando as restrições de filtro e agrupamento).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "get",
    "url": "/caixa/:caixa_id/vazamentos",
    "title": "Obter vazamentos",
    "name": "getVazamentos",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa de agua.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "vazamentos",
            "description": "<p>Vazamentos da caixa.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "post",
    "url": "/caixa/:caixa_id",
    "title": "Atualizar informações de caixa de agua",
    "name": "updateCaixa",
    "group": "Caixa",
    "description": "<p>Todos os parâmetros devem estar encapsulados em um json.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome para a caixa de agua (Obrigatório).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "10..",
            "optional": false,
            "field": "descricao",
            "defaultValue": "Nenhuma descrição informada",
            "description": "<p>Descrição para a caixa de agua (Obrigatório).</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "caracteristicasFisicas",
            "description": "<p>Caracteristicas fisicas da caixa de agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao",
            "description": "<p>Localização da caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao.setor",
            "description": "<p>Setor onde a caixa d'água está localizada.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao.bloco",
            "description": "<p>Bloco onde a caixa d'água está localizada.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.area",
            "description": "<p>Área ocupada pela caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_pavimentos",
            "description": "<p>Número de pavimentos da caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.ocupacaoMedia",
            "description": "<p>Ocupação Média da caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.volumeReservatorio",
            "description": "<p>Capacidade da caixa d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "mediaEsperada",
            "description": "<p>Média de consumo esperada (No dia).</p>"
          },
          {
            "group": "Parameter",
            "type": "json[]",
            "optional": true,
            "field": "historicoConsumo",
            "description": "<p>Histórico de consumo da caixa.</p>"
          },
          {
            "group": "Parameter",
            "type": "json[]",
            "optional": true,
            "field": "vazamentos",
            "description": "<p>Histórico de vazamentos da caixa.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "put",
    "url": "/caixa/:caixa_id/consumo/:consumo_id",
    "title": "Atualizar informações sobre um consumo",
    "name": "updateConsumo",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa de agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "consumo_id",
            "description": "<p>Identificador do consumo.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "data",
            "description": "<p>Data do registro.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "consumo",
            "description": "<p>Volume consumido registrado.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "consumos",
            "description": "<p>Consumos da caixa (após a atualização do consumo).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "post",
    "url": "/caixa/:caixa_id/vazamentos/:vazamento_id",
    "title": "Atualizar informações de um vazamento",
    "name": "updateVazamento",
    "group": "Caixa",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caixa_id",
            "description": "<p>Identificador da caixa de agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vazamento_id",
            "description": "<p>Identificador do vazamento a ser removido.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "data",
            "description": "<p>Data do vazamento.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "volume",
            "description": "<p>Volume do vazamento.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "resposta",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "resposta.message",
            "description": "<p>Mensagem informando o sucesso da alteração: &quot;Vazamento atualizado&quot;.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/caixaDeAguaApi.js",
    "groupTitle": "Caixa"
  },
  {
    "type": "post",
    "url": "/edificio/",
    "title": "Adicionar um edificio.",
    "name": "CreateEdificio",
    "group": "Edificio",
    "description": "<p>Todos os parâmetros devem estar encapsulados em um json.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome para o edificio (Obrigatório).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "10..",
            "optional": false,
            "field": "descricao",
            "defaultValue": "Nenhuma descrição informada",
            "description": "<p>Descrição para o edificio d'agua (Obrigatório).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "img",
            "description": "<p>Imagem do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "caracteristicasFisicas",
            "description": "<p>Caracteristicas fisicas do edificio d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao",
            "description": "<p>Localização do edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao.setor",
            "description": "<p>Setor onde o edificio está localizado.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao.bloco",
            "description": "<p>Bloco onde o edificio está localizado.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.area",
            "description": "<p>Área ocupada pelo edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_pavimentos",
            "description": "<p>Número de pavimentos do edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.ocupacaoMedia",
            "description": "<p>Ocupação Média do edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.volumeReservatorio",
            "description": "<p>Capacidade do edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_baciasSanitarias",
            "description": "<p>Número de bacias sanitárias do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_torneiras",
            "description": "<p>Número de torneiras do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_duchas",
            "description": "<p>Número de duchas do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_chuveiros",
            "description": "<p>Número de chuveiros do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_pias",
            "description": "<p>Número de pias do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "mediaEsperada",
            "description": "<p>Média de consumo esperada (No dia).</p>"
          },
          {
            "group": "Parameter",
            "type": "json[]",
            "optional": true,
            "field": "historicoConsumo",
            "description": "<p>Histórico de consumo do edificio.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "edificio:",
          "content": "\"mediaEsperada\": 200,\n\"geolocalizacao\": {\n        \"latitude\": -7.2131092,\n        \"longitude\": -35.9076118\n },\n\"caracteristicasFisicas\": {\n        \"area\": 100,\n        \"n_pavimentos\": 3,\n        \"ocupacaoMedia\": 0,\n        \"n_baciasSanitarias\": 0,\n        \"n_torneiras\": 32,\n        \"n_duchas\": 2,\n        \"n_chuveiros\": 0,\n        \"n_pias\": 22,\n        \"volumeReservatorio\": 40,\n        \"localizacao\": {\n            \"setor\": \"B\",\n            \"bloco\": \"CH\"\n        }\n    },\n \"nome\": \"Centro de Humanidades\",\n \"atividade\": \"Educativo\",\n \"descricao\": \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis ante augue. Phasellus volutpat neque ac dui mattis vulputate.\"\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "edifico",
            "description": "<p>O edificio adicionado.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio"
  },
  {
    "type": "get",
    "url": "/edificio/:id/consumo",
    "title": "Obter informações de consumo de um edificio",
    "name": "GetUser",
    "group": "Edificio",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Identificador unico para o edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "String/Date",
            "optional": true,
            "field": "ano",
            "description": "<p>Valor para filtrar os consumos do ano referente.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio"
  },
  {
    "type": "get",
    "url": "/edificio",
    "title": "Obter todos os edificios.",
    "name": "IndexEdificio",
    "group": "Edificio",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "setor",
            "description": "<p>(Query) Filtrar o resultado obtido por setor.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nivelAlerta",
            "description": "<p>(Query) Filtrar o resultado obtido por estado de alerta, nível 0 ou 1.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "withAlerta",
            "description": "<p>(Query) Filtrar o resultado para edificios com algum dos níveis de alerta.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "edificios",
            "description": "<p>Todos edificios obtidos.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio"
  },
  {
    "type": "get",
    "url": "/edificio",
    "title": "Obter um edificio.",
    "name": "ShowEdificio",
    "group": "Edificio",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "edificio_id",
            "description": "<p>Identificador unico para o edificio</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "edificio",
            "description": "<p>O edificio de id informado.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio"
  },
  {
    "type": "delete",
    "url": "/edificio/:edificio_id",
    "title": "Remover um edificio.",
    "name": "ShowEdificio",
    "group": "Edificio",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "edificio_id",
            "description": "<p>Identificador unico para o edificio</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "edificio",
            "description": "<p>Mensagem informando que o edificio de id informado foi removido.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio"
  },
  {
    "type": "put",
    "url": "/edificio/:edificio_id",
    "title": "Atualizar um edificio.",
    "name": "UpdateEdificio",
    "group": "Edificio",
    "description": "<p>Todos os parâmetros devem estar encapsulados em um json.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "edificio_id",
            "description": "<p>Identificador unico para o edificio</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "nome",
            "description": "<p>Nome para o edificio (Obrigatório).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "10..",
            "optional": true,
            "field": "descricao",
            "description": "<p>=&quot;Nenhuma descrição informada&quot;     Descrição para o edificio d'agua (Obrigatório).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "img",
            "description": "<p>Imagem do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": true,
            "field": "caracteristicasFisicas",
            "description": "<p>Caracteristicas fisicas do edificio d'agua.</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao",
            "description": "<p>Localização do edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao.setor",
            "description": "<p>Setor onde o edificio está localizado.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caracteristicasFisicas.localizacao.bloco",
            "description": "<p>Bloco onde o edificio está localizado.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.area",
            "description": "<p>Área ocupada pelo edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_pavimentos",
            "description": "<p>Número de pavimentos do edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.ocupacaoMedia",
            "description": "<p>Ocupação Média do edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.volumeReservatorio",
            "description": "<p>Capacidade do edificio.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_baciasSanitarias",
            "description": "<p>Número de bacias sanitárias do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_torneiras",
            "description": "<p>Número de torneiras do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_duchas",
            "description": "<p>Número de duchas do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_chuveiros",
            "description": "<p>Número de chuveiros do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "caracteristicasFisicas.n_pias",
            "description": "<p>Número de pias do edifício.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "mediaEsperada",
            "description": "<p>Média de consumo esperada (No dia).</p>"
          },
          {
            "group": "Parameter",
            "type": "json[]",
            "optional": true,
            "field": "historicoConsumo",
            "description": "<p>Histórico de consumo do edificio.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "edificio:",
          "content": "\"mediaEsperada\": 200,\n\"geolocalizacao\": {\n        \"latitude\": -7.2131092,\n        \"longitude\": -35.9076118\n },\n\"caracteristicasFisicas\": {\n        \"area\": 100,\n        \"n_pavimentos\": 3,\n        \"ocupacaoMedia\": 0,\n        \"n_baciasSanitarias\": 0,\n        \"n_torneiras\": 32,\n        \"n_duchas\": 2,\n        \"n_chuveiros\": 0,\n        \"n_pias\": 22,\n        \"volumeReservatorio\": 40,\n        \"localizacao\": {\n            \"setor\": \"B\",\n            \"bloco\": \"CH\"\n        }\n    },\n \"nome\": \"Centro de Humanidades\",\n \"atividade\": \"Educativo\",\n \"descricao\": \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis ante augue. Phasellus volutpat neque ac dui mattis vulputate.\"\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Mensagem",
            "description": "<p>Um mensagem informando que o edifício atualizado.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio"
  },
  {
    "type": "post",
    "url": "/edificio/:edificio_id/alertas/new",
    "title": "Adicionar um novo alerta a um edificio",
    "name": "CreateAlerta",
    "group": "Edificio_Alertas",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "edificio_id",
            "description": "<p>Identificador unico para o edificio</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "data",
            "description": "<p>Data em que o alerta foi gerado, se a hora não for informada ela será 00:00:00BRT</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "checked",
            "description": "<p>Se o alerta foi verificado ou não.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "alerta:",
          "content": "{\n  \"data\": 2011-07-14T19:43:37\n  \"checked\": False\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "alertas",
            "description": "<p>Todos os alertas do edificio, incluindo o inserido.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio_Alertas"
  },
  {
    "type": "delete",
    "url": "/edificio/:edificio_id/alertas/:alerta_id",
    "title": "Deletar um alerta de um edificio.",
    "name": "DeleteAlerta",
    "group": "Edificio_Alertas",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "edificio_id",
            "description": "<p>Identificador unico para o edificio</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "alerta_id",
            "description": "<p>Identificador unico para o alerta.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "message",
            "description": "<p>Json com uma mensagem informando que o alerta foi removido.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio_Alertas"
  },
  {
    "type": "get",
    "url": "/edificio/:edificio_id/alertas",
    "title": "Obter todos alertas de um edificio",
    "name": "IndexAlertas",
    "group": "Edificio_Alertas",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "edificio_id",
            "description": "<p>Identificador unico para o edificio</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "alertas",
            "description": "<p>Todos os alertas do edificio.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio_Alertas"
  },
  {
    "type": "get",
    "url": "/edificio/:edificio_id/alertas/:alerta_id",
    "title": "Obter um alerta de um edificio.",
    "name": "ShowAlertas",
    "group": "Edificio_Alertas",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "edificio_id",
            "description": "<p>Identificador unico para o edificio</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "alerta_id",
            "description": "<p>Identificador unico para o alerta.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "alerta",
            "description": "<p>O alerta requisitado do edificio requisitado.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio_Alertas"
  },
  {
    "type": "put",
    "url": "/edificio/:edificio_id/alertas/:alerta_id",
    "title": "Atualizar um alerta de um edificio.",
    "name": "UpdateAlerta",
    "group": "Edificio_Alertas",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "edificio_id",
            "description": "<p>Identificador unico para o edificio</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "alerta_id",
            "description": "<p>Identificador unico para o alerta.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "data",
            "description": "<p>Data em que o alerta foi gerado, se a hora não for informada ela será 00:00:00BRT</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "checked",
            "description": "<p>Se o alerta foi verificado ou não.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "alerta:",
          "content": "{\n  \"data\": 2011-07-14T19:43:37\n  \"checked\": True\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "message",
            "description": "<p>Json com uma mensagem informando que o alerta foi atualizado.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/edificioApi.js",
    "groupTitle": "Edificio_Alertas"
  }
] });
