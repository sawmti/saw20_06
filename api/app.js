const express = require('express');
const path = require('path');
var fetch = require('node-fetch');
var wbk = require('wikidata-sdk');
var md5 = require('blueimp-md5'); 

const app = express()
app.use(express.json()) 
const root = path.resolve(__dirname, '..')

// Log invocations
app.use(function(req, res, next) { console.log(req.url); next(); });

// Directly serve static content from /client
app.use(express.static(root + '/client'));

// Simple REST API that returns some entities
app.get('/api/entities', (req,res) => 
 res.send({ entities: 
   ['Q2887', 
    'Q33986'
   ]})
);



var listaFavoritos = [{
  idtopico: "Q2887",
  descripcion: "capital de Chile",
  label: "Santiago de Chile",
  urlimagen: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Santiago_en_invierno.jpg",
  favorito: true,
  anotaciones: [
    {
      nombre: "Poblacion",
      detalle: "8MM",
    },
    {
      nombre: "Region",
      detalle: "Metropolitana",
    },    
  ],
}];

app.post('/modificartema', function(req, response){
  console.log(req.body);
  let itemmodificar = req.body;

  listaFavoritos.forEach(function(result, index) {
    if(result['idtopico'] === itemmodificar.idtopico) {
      result['descripcion'] = itemmodificar.descripcion;
      result['label'] = itemmodificar.label;
      result['anotaciones'] = itemmodificar.anotaciones;
    }    
  });

  response.sendStatus(201);  
});

app.delete('/quitarfavorito', function(req, response){
  console.log(req.body);
  let itemFavorito = req.body;

  listaFavoritos.forEach(function(result, index) {
    if(result['idtopico'] === itemFavorito.idtopico) {
      listaFavoritos.splice(index, 1);
    }    
  });

  response.sendStatus(201);  
});

app.post('/agregarfavorito', function(req, response){
  console.log(req.body);
  let itemFavorito = req.body;
  listaFavoritos.push(itemFavorito);  
  response.sendStatus(201);  
});

app.get('/obtenerfavoritos', function(req, response){
  response.send(listaFavoritos);
});

app.get('/ejecutarQuery/:txtquery', function(req, response) {
  let query = req.params.txtquery;
  query = query.replace(/@/g, '?');
  const url = wbk.sparqlQuery(query);
  fetch(url)  
  .then(res => res.json())
  .then(json => {

    let listaQuery = [];
    let data = wbk.simplify.sparqlResults(json, { minimize: true })
    for(let i = 0, res; res = data[i];i++)    
    {
      let itemresult = {
        codigo: res.item.value,
        label: res.item.label,
        region: res.regionLabel,
        poblacion: res.poblacion,
        nacimiento: res.lugarNacimientoLabel,
        fundador: res.fundador?.label,
        fundadorCodigo: res.fundador?.value
      };
      listaQuery.push(itemresult);
    }

    response.send(listaQuery);
  });

});

app.get('/entidades/:txtEntidad', function(req, response){  

  let entidad = req.params.txtEntidad;
  const urlentidad = wbk.searchEntities(entidad);   
 
  fetch(urlentidad)
      .then(res => res.json())
      .then(json => {
          var idsEntidades = [];
          for (var i = 0, fila; fila = json.search[i]; i++) {
              idsEntidades.push(fila.id);
          }

          const urlids = wbk.getEntities({
              ids: idsEntidades,
              languages: [ 'es' ]
            });
          
          fetch(urlids)
            .then(resids => resids.json())
            .then(wbk.parse.wb.entities)
            .then(entities => {

              var listacompuesta = [];

              for (var propertyName in entities) {
                var listadoPropiedades = entities[propertyName];
                var descripcionPropiedad = (listadoPropiedades.descriptions.es === undefined ? '-' : listadoPropiedades.descriptions.es);
                var labelPropiedad = (listadoPropiedades.labels.es === undefined ? 'Sin Información' : listadoPropiedades.labels.es);
                var urlImagen;
                for (var propertyTopic in listadoPropiedades.claims) {                  

                  var nombrePais;
                  if (propertyTopic == 'P17') {
                    var objeto = listadoPropiedades.claims[propertyTopic];
                    nombrePais = objeto[0];
                  }

                  if (propertyTopic == 'P18') {
                    var objeto = listadoPropiedades.claims[propertyTopic];
                    var nombreImagen = objeto[0];
                    nombreImagen = nombreImagen.split(' ').join('_')
                    var md5sum = md5(nombreImagen);
                    var a = md5sum[0];
                    var b = md5sum[1];
                    urlImagen = 'https://upload.wikimedia.org/wikipedia/commons/' + a + '/' + a + '' + b + '/' + nombreImagen;
                  }
                }

                if (descripcionPropiedad != '-') {
                  console.log('(' + propertyName + ') ' + descripcionPropiedad + ' - ' + labelPropiedad + '  = URL(' + (urlImagen === undefined?'-': urlImagen) + ')');
                  
                  let itemFavorito;
                  for(let k=0, item; item = listaFavoritos[k]; k++)
                  {
                      if(item.idtopico == propertyName)
                      {
                        itemFavorito = item;
                        break
                      }
                  }
                  if(itemFavorito === undefined)
                  {
                    var item = {
                      idtopico: propertyName,
                      descripcion: descripcionPropiedad,
                      label: labelPropiedad,
                      urlimagen: urlImagen,
                      favorito: false,
                      anotaciones: []
                    };                   
  
                    listacompuesta.push(item);

                  }
                  else
                  {
                    listacompuesta.push(itemFavorito);
                  }

                  urlImagen = undefined;
                }
              }

              response.send(listacompuesta);
    
            });
      });
});

module.exports = app
