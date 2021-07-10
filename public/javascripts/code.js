
async function getEntities(entidad) {
    const response = await fetch('/entidades/'+ entidad)
    .then(res => res.json())
    .then(json => {
        //debugger;
        var contenedor = document.getElementById('divContenedor');
        contenedor.innerHTML = '';
        for (var i = 0, fila; fila = json[i]; i++) {
            var div = document.createElement('div');
            if(i % 2 === 0)            
            {
                div.innerHTML = `
                <hr class="featurette-divider">
                <div class="row featurette">
                    <div class="col-md-7">
                        <h2 class="featurette-heading">`+fila.descripcion+`</h2>
                        <p class="lead">`+fila.label+`</p>
                        <a href="https://www.wikidata.org/wiki/`+fila.idtopico+`">WikiData (`+fila.idtopico+`)</a>
                    </div>
                    <div class="col-md-5">            
                        <img src="`+(fila.urlimagen === undefined ? 'https://image.freepik.com/vector-gratis/pagina-error-404-no-encontrada_41910-364.jpg': fila.urlimagen )+`" width="500" height="500" />        
                    </div>
                </div>            
                            `;
            }
            else
            {

                div.innerHTML = `
                <hr class="featurette-divider">
                <div class="row featurette">
                    <div class="col-md-7 order-md-2">
                        <h2 class="featurette-heading">`+fila.descripcion+`</h2>
                        <p class="lead">`+fila.label+`</p>
                        <a href="https://www.wikidata.org/wiki/`+fila.idtopico+`">WikiData (`+fila.idtopico+`)</a>
                    </div>
                    <div class="col-md-5 order-md-1">            
                        <img src="`+(fila.urlimagen === undefined ? 'https://image.freepik.com/vector-gratis/pagina-error-404-no-encontrada_41910-364.jpg': fila.urlimagen )+`" width="500" height="500" />
                    </div>
                </div>          
                            `;
            }
            
            contenedor.appendChild(div);
        }
    });
}


function buscarEntidades(){    
    var txt = document.getElementById('txtBuscar');    
    getEntities(txt.value);
    console.log("Procesando resultados!!");
}

