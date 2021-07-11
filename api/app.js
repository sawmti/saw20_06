const express = require('express');
const path = require('path');
var fetch = require('node-fetch');
var wbk = require('wikidata-sdk');
var md5 = require('blueimp-md5'); 

const app = express()
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


app.get('/entidades/:txtEntidad', function(req, response){  

  var entidad = req.params.txtEntidad;
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
                  var item = {
                    idtopico: propertyName,
                    descripcion: descripcionPropiedad,
                    label: labelPropiedad,
                    urlimagen: urlImagen
                  };

                  urlImagen = undefined;
                  listacompuesta.push(item);
                  
                }
              }

              response.send(listacompuesta);
    
            });
      });
});


module.exports = app
