define({ "api": [
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
  }
] });
