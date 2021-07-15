
$(window).load(function () {
    $('#btnBuscar').click(function(e){
        var txt = document.getElementById('txtBuscar');    
        getEntities(txt.value);
        console.log("Procesando resultados!!");
    });

    var listadoEntidades =[];

    async function getEntities(entidad) {
        const response = await fetch('/entidades/'+ entidad)
        .then(res => res.json())
        .then(json => {
            //debugger;
            let contenedor = document.getElementById('divContenedor');
            contenedor.innerHTML = '';
            for (let i = 0, fila; fila = json[i]; i++) {
                let div = document.createElement('div');
                let sideClassDiv = (i % 2 === 0 ? '': 'order-md-2')
                let sideClassImg = (i % 2 === 0 ? '': 'order-md-1')                

                div.innerHTML = `
                    
                <div class="row featurette divBorde">
                    <div class="col-md-7 ${sideClassDiv}" id="card_${fila.idtopico}">
                        <h3>${fila.descripcion}</h3>
                        <p class="lead">${fila.label}</p>
                        <a href="https://www.wikidata.org/wiki/${fila.idtopico}">WikiData (${fila.idtopico})</a>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <input type="button" value="Opciones" ${(fila.favorito?'':'style="display: none;"')}  class="boton1 btnOpciones" tooltip="Opciones topico"     id="btnOpciones_${fila.idtopico}"></input>
                        <input type="button" value="X"        ${(fila.favorito?'':'style="display: none;"')}  class="boton2 btnQuitar"   tooltip="Quitar de Favoritos" id="btnQuitar_${fila.idtopico}"></input>
                        <input type="button" value="+"        ${(fila.favorito?'style="display: none;"':'')}  class="boton3 btnAgregar"  tooltip="Agregar a Favoritos" id="btnAgregar_${fila.idtopico}"></input>
                    </div>

                    <div class="col-md-7" id="opciones_${fila.idtopico}" style="display: none;">
                        <h3>Modificar Datos (${fila.idtopico})</h3>
                        <table>
                            <tr> <td>Titulo</td>      <td>:<input type="text" value="${fila.descripcion}"/> </td></tr>
                            <tr> <td>Descripción</td> <td>:<input type="text" value="${fila.label}"/>       </td></tr>
                            <tr><td></td></tr>
                        </table>
                        <span style="font-size: 20px;font-weight: bold;">Anotaciones:</span>
                        <table>
                            <tr><td><input type="text" placeholder="Ingresar descripción" /></td><td>:</td><td><input type="text" placeholder="Ingresar valor" /></td></tr>
                            <tr><td><input type="text" placeholder="Ingresar descripción" /></td><td>:</td><td><input type="text" placeholder="Ingresar valor"/></td></tr>
                            <tr><td><input type="text" placeholder="Ingresar descripción" /></td><td>:</td><td><input type="text" placeholder="Ingresar valor"/></td></tr>
                            <tr><td><input type="text" placeholder="Ingresar descripción" /></td><td>:</td><td><input type="text" placeholder="Ingresar valor"/></td></tr>
                            <tr><td><input type="text" placeholder="Ingresar descripción" /></td><td>:</td><td><input type="text" placeholder="Ingresar valor"/></td></tr>
                        </table>
                        <br>
                        <input type="button" value="Grabar"   class="boton1 btnOpcionesGrabar" id="btnOpcionesGrabar_${fila.idtopico}"></input>                            
                        <input type="button" value="Cancelar" class="boton4 btnOpcionesVolver" id="btnOpcionesVolver_${fila.idtopico}"></input>                            
                    </div>

                    <div class="col-md-5 ${sideClassImg}">
                        <img style="10px" src="`+(fila.urlimagen === undefined ? 'https://image.freepik.com/vector-gratis/pagina-error-404-no-encontrada_41910-364.jpg': fila.urlimagen )+`" width="250" height="250" />        
                    </div>
                </div>   
                <hr class="featurette-divider">
                            `;
                
                contenedor.appendChild(div);
            }

            $(".btnOpcionesGrabar").unbind('click');
            $(".btnOpcionesGrabar").click(function(e){
                //debugger;
                let idDiv = e.currentTarget.id.replace("btnOpcionesGrabar_","");
                alert(`Grabar opciones tema: ${idDiv}`);                
            });

            $(".btnQuitar").unbind('click');
            $(".btnQuitar").click(function(e){
                //debugger;
                let idDiv = e.currentTarget.id.replace("btnQuitar_","");

                setTimeout(function(){$("#btnQuitar_"+idDiv).hide("fade", 500);}, 1);
                setTimeout(function(){$("#btnOpciones_"+idDiv).hide("fade", 500);}, 1);
                setTimeout(function(){$("#btnAgregar_"+idDiv).show("fade", 500);}, 500);

                for (let i = 0, fila; fila = json[i]; i++){
                    if(fila.idtopico == idDiv)
                    {
                        fila.favorito = false;
                        break;
                    }
                }

            });

            $(".btnAgregar").unbind('click');
            $(".btnAgregar").click(function(e){
                //debugger;
                let idDiv = e.currentTarget.id.replace("btnAgregar_","");

                setTimeout(function(){$("#btnAgregar_"+idDiv).hide("fade", 500);}, 1);
                setTimeout(function(){$("#btnQuitar_"+idDiv).show("fade", 500);}, 500);
                setTimeout(function(){$("#btnOpciones_"+idDiv).show("fade", 500);}, 500);                
                for (let i = 0, fila; fila = json[i]; i++){
                    if(fila.idtopico == idDiv)
                    {
                        fila.favorito = true;
                        break;
                    }
                }
            });

            $(".btnOpciones").unbind('click');
            $(".btnOpciones").click(function(e){
                //debugger;
                let idDiv = e.currentTarget.id.replace("btnOpciones_","");                
                setTimeout(function(){$("#card_"+idDiv).hide("fade", 500);}, 1);
                setTimeout(function(){$("#opciones_"+idDiv).show("fade", 500);}, 500);
                
            });

            $(".btnOpcionesVolver").unbind('click');
            $(".btnOpcionesVolver").click(function(e){
                //debugger;
                let idDiv = e.currentTarget.id.replace("btnOpcionesVolver_","");                

                setTimeout(function(){$("#opciones_"+idDiv).hide("fade", 500);}, 1);
                setTimeout(function(){$("#card_"+idDiv).show("fade", 500);}, 500);
            });

        });
    }

});
