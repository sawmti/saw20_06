
$(window).load(function () {

    
    $('#btnBuscar').click(function(e){
        var txt = document.getElementById('txtBuscar');    
        getEntities(txt.value);        
    });

    $('#btnInicio').click(function(e){        
        let contenedor = document.getElementById('divContenedor');
        contenedor.innerHTML = '';
        $("#divContenedor").hide();
        $("#divQuery").hide();
    });

    $('#btnFavoritos').click(function(e){        
        fetch('/obtenerfavoritos')
        .then(res => res.json())
        .then(json => {
            //debugger;            
            llenarEntidades(json, 'Temas Favoritos');
            $("#divQuery").hide();
            $("#divContenedor").show("fade", 500);
        });
    });
    
    $('#btnQuery').click(function(e) {
        let contenedor = document.getElementById('divContenedor');
        contenedor.innerHTML = '';
        $("#divContenedor").hide();
        $("#divQuery").show("fade", 500);
    });

    $('.btnEjecutar').click(function(e) {
        
        let idDiv = e.currentTarget.id.replace("btnEjecutar_","");        
        let query = $("#txtQuery"+idDiv)[0].value;
        query = query.split('?').join('@');
        fetch('/ejecutarQuery/'+query)
        .then(res => res.json())
        .then(json => {
            debugger;
            let contenedor = document.getElementById('divContendorQuery_'+idDiv);
            contenedor.innerHTML = '';

            for (let i = 0, fila; fila = json[i]; i++)
            {
                let div = document.createElement('div');
                if(idDiv == "1")
                {
                    div.innerHTML = `
                    <li> ${fila.label} (${fila.region})  <a href="https://www.wikidata.org/wiki/${fila.codigo}">${fila.codigo}</a></li>
                   `;
                }

                if(idDiv == "2")
                {
                    div.innerHTML = `
                    <li> ${fila.label} (${fila.poblacion})  <a href="https://www.wikidata.org/wiki/${fila.codigo}">${fila.codigo}</a></li>
                   `;
                }

                if(idDiv == "3")
                {
                    div.innerHTML = `
                    <li> ${fila.fundador} (${fila.label})  <a href="https://www.wikidata.org/wiki/${fila.fundadorCodigo}">${fila.fundadorCodigo}</a></li>
                   `;
                }
                
                contenedor.appendChild(div);
            }            

        });
    });

    function llenarEntidades(datos, titulo)
    {
        let contenedor = document.getElementById('divContenedor');
        contenedor.innerHTML = '';
        var titulodiv = document.createElement('div');
        titulodiv.innerHTML = `<h2>${titulo}</h2>`;
        contenedor.appendChild(titulodiv);
        for (let i = 0, fila; fila = datos[i]; i++) {
            let div = document.createElement('div');
            let sideClassDiv = (i % 2 === 0 ? '': 'order-md-2')
            let sideClassImg = (i % 2 === 0 ? '': 'order-md-1')
            let imgAlign = (i % 2 === 0 ? 'text-align: right;': '')
            let favoritoStyle = fila.favorito? "background-color: #E9FFE1":"";

            let filasAnotaciones = '';
            for (let j = 0, anotacion; anotacion = fila.anotaciones[j]; j++)
            {
                filasAnotaciones+= `<tr> <td><span>${anotacion.nombre}</span></td> <td>:<span>${anotacion.detalle}</span> </td></tr>`;
            }

            let filasAnotacionesInput = '';
            var cantidadAnotaciones = 0;
            for (let k = 0, anotacionInput; anotacionInput = fila.anotaciones[k]; k++)
            {
                cantidadAnotaciones++;
                filasAnotacionesInput+= `<tr id="filaAnotacion_${fila.idtopico}_${k}">
                                            <td><span style="margin-right: 5px;color: red; text-decoration: underline; cursor: pointer;" class="borrarAnotacion" id="borrarAnotacion_${fila.idtopico}_${k}">X</span></td>
                                            <td class="nombre"><input type="text" placeholder="Ingresar descripción" value="${anotacionInput.nombre}" id="descripcionAnotacion_${fila.idtopico}_${k}" /></td>
                                            <td>:</td><td class="detalle"><input type="text" placeholder="Ingresar valor" value="${anotacionInput.detalle}" id="valorAnotacion_${fila.idtopico}_${k}" /></td>
                                        </tr>`;                
            }

            div.innerHTML = `
            
            <div class="row featurette divBorde" id="divBorde_${fila.idtopico}" style="${favoritoStyle}">
                <div class="col-md-7 ${sideClassDiv}" id="card_${fila.idtopico}">
                    <h3><span id="titulo_${fila.idtopico}">${fila.descripcion}</span></h3>
                    <p class="lead" id="descripcion_${fila.idtopico}">${fila.label}</p>
                    <a href="https://www.wikidata.org/wiki/${fila.idtopico}">WikiData (${fila.idtopico})</a>
                    <div style="min-height: 130px;">
                        <span style="font-size: 20px;font-weight: bold;">Anotaciones:</span>
                        <table id="tableAnotaciones_${fila.idtopico}">${filasAnotaciones}</table>
                    </div>
                    <br>
                    <input type="button" value="Opciones" ${(fila.favorito?'':'style="display: none;"')}  class="boton1 btnOpciones" tooltip="Opciones topico"     id="btnOpciones_${fila.idtopico}"></input>
                    <input type="button" value="X"        ${(fila.favorito?'':'style="display: none;"')}  class="boton2 btnQuitar"   tooltip="Quitar de Favoritos" id="btnQuitar_${fila.idtopico}"></input>
                    <input type="button" value="+"        ${(fila.favorito?'style="display: none;"':'')}  class="boton3 btnAgregar"  tooltip="Agregar a Favoritos" id="btnAgregar_${fila.idtopico}"></input>
                </div>

                <div class="col-md-7 ${sideClassDiv}" id="opciones_${fila.idtopico}" style="display: none;">
                    <h3>Modificar Datos (${fila.idtopico})</h3>
                    <table>
                        <tr> <td>Titulo</td>     <td>:</td> <td><input id="titulotopico_${fila.idtopico}" type="text" value="${fila.descripcion}"/> </td></tr>
                        <tr> <td>Descripción</td> <td>:</td> <td><input id="descripciontopico_${fila.idtopico}" type="text" value="${fila.label}"/>       </td></tr>
                        <tr><td></td></tr>
                    </table>                    
                    <div style="min-height: 130px;">
                        <span style="font-size: 20px;font-weight: bold;">Anotaciones:</span>
                        <span style="margin-left: 10px;color: blue; text-decoration: underline; cursor: pointer;" id="agregarAnotacion_${fila.idtopico}" class="agregarAnotacion">Agregar anotación</span>
                        <table id="tableAnotacionesInput_${fila.idtopico}"> ${filasAnotacionesInput} </table>
                    </div>
                    <br>
                    <input type="button" value="Grabar"   class="boton1 btnOpcionesGrabar" id="btnOpcionesGrabar_${fila.idtopico}"></input>                            
                    <input type="button" value="Cancelar" class="boton4 btnOpcionesVolver" id="btnOpcionesVolver_${fila.idtopico}"></input>                            
                </div>

                <div class="col-md-5 ${sideClassImg}" style="${imgAlign}">
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
            let idDiv = e.currentTarget. id.replace("btnOpcionesGrabar_","");

            let listadoAnotaciones = [];
            $(`#tableAnotacionesInput_${idDiv} > tbody  > tr`).each(function(index, tr) {                
                //debugger;
                let fila = {
                    nombre: "",
                    detalle: ""
                }
                for(let i=0, celda; celda = tr.childNodes[i] ; i++) {
                    if(celda.className == "nombre") fila.nombre = celda.childNodes[0].value;
                    if(celda.className == "detalle") fila.detalle = celda.childNodes[0].value;
                }
                listadoAnotaciones.push(fila);
             });

            //debugger;
            var item = {
                idtopico: idDiv,
                descripcion: $("#titulotopico_"+idDiv)[0].value,
                label: $("#descripciontopico_"+idDiv)[0].value,                
                anotaciones: listadoAnotaciones
              };        

            fetch('/modificartema',{
                method: 'post',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
            .then(res => res.text())
            .then(result => {                        
                if(result == "Created")
                {
                    //debugger;
                    $("#titulo_"+idDiv)[0].innerHTML =  $("#titulotopico_"+idDiv)[0].value;
                    $("#descripcion_"+idDiv)[0].innerHTML =  $("#descripciontopico_"+idDiv)[0].value;

                    let filaAnotacionesMod = "";
                    for(let j=0, anot; anot = listadoAnotaciones[j] ; j++)
                    {
                        filaAnotacionesMod += `<tr> <td><span>${anot.nombre}</span></td> <td>:<span>${anot.detalle}</span> </td></tr>`;
                    }
                    $("#tableAnotaciones_"+idDiv)[0].innerHTML = "";
                    $("#tableAnotaciones_"+idDiv).append(filaAnotacionesMod);

                    setTimeout(function(){$("#opciones_"+idDiv).hide("fade", 500);}, 1);
                    setTimeout(function(){$("#card_"+idDiv).show("fade", 500);}, 500);
                    return;
                }
                alert(result);
            });
            
        });

        $(".btnOpcionesVolver").unbind('click');
        $(".btnOpcionesVolver").click(function(e){
            //debugger;
            let idDiv = e.currentTarget.id.replace("btnOpcionesVolver_","");                

            setTimeout(function(){$("#opciones_"+idDiv).hide("fade", 500);}, 1);
            setTimeout(function(){$("#card_"+idDiv).show("fade", 500);}, 500);
        });

        $(".borrarAnotacion").unbind('click');
        $(".borrarAnotacion").click(function(e){
            let idDiv = e.currentTarget.id.replace("borrarAnotacion_","");

            var elem = document.getElementById(`filaAnotacion_${idDiv}`);
            elem.parentNode.removeChild(elem);            
        });

        $(".agregarAnotacion").unbind('click');
        $(".agregarAnotacion").click(function(e){
            let idDiv = e.currentTarget.id.replace("agregarAnotacion_","");
            let filaAnotacion = `<tr id="filaAnotacion_${idDiv}_${cantidadAnotaciones}">
                                    <td><span style="margin-right: 5px;color: red; text-decoration: underline; cursor: pointer;" class="borrarAnotacionInterna" id="borrarAnotacion_${idDiv}_${cantidadAnotaciones}">X</span></td>
                                    <td class="nombre"><input type="text" placeholder="Ingresar descripción" id="descripcionAnotacion_${idDiv}_${cantidadAnotaciones}" /></td>
                                    <td>:</td><td class="detalle"><input type="text" placeholder="Ingresar valor" id="valorAnotacion_${idDiv}_${cantidadAnotaciones}" /></td>
                                </tr>`;
            $("#tableAnotacionesInput_"+idDiv).append(filaAnotacion);
            cantidadAnotaciones++;

            $(".borrarAnotacionInterna").unbind('click');
            $(".borrarAnotacionInterna").click(function(e){
                let idDiv = e.currentTarget.id.replace("borrarAnotacion_","");
    
                var elem = document.getElementById(`filaAnotacion_${idDiv}`);
                elem.parentNode.removeChild(elem);            
            });
        });

        $(".btnQuitar").unbind('click');
        $(".btnQuitar").click(function(e){
            //debugger;
            let idDiv = e.currentTarget.id.replace("btnQuitar_","");          

            for (let i = 0, fila; fila = datos[i]; i++){
                if(fila.idtopico == idDiv)
                {
                    fila.favorito = false;

                    fetch('/quitarfavorito',{
                        method: 'DELETE',
                        headers: {
                          'Accept': 'application/json, text/plain, */*',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(fila)
                      })
                    .then(res => res.text())
                    .then(result => {                        
                        if(result == "Created")
                        {
                            setTimeout(function(){$("#btnQuitar_"+idDiv).hide("fade", 500);}, 1);
                            setTimeout(function(){$("#btnOpciones_"+idDiv).hide("fade", 500);}, 1);
                            setTimeout(function(){$("#btnAgregar_"+idDiv).show("fade", 500);}, 500);
                
                            $("#divBorde_" + idDiv).css("background-color", "#fff");
                            $("#divBorde_"+idDiv).effect("highlight", { color: "#F5A9A9" }, 500);
                            return;
                        }
                        alert(result);
                    });
                    break;
                }
            }

        });

        $(".btnAgregar").unbind('click');
        $(".btnAgregar").click(function(e){
            //debugger;
            let idDiv = e.currentTarget.id.replace("btnAgregar_","");

            for (let i = 0, fila; fila = datos[i]; i++){
                if(fila.idtopico == idDiv)
                {
                    fila.favorito = true;

                    fetch('/agregarfavorito',{
                        method: 'post',
                        headers: {
                          'Accept': 'application/json, text/plain, */*',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(fila)
                      })
                    .then(res => res.text())
                    .then(result => {                        
                        if(result == "Created")
                        {
                            setTimeout(function(){$("#btnAgregar_"+idDiv).hide("fade", 500);}, 1);
                            setTimeout(function(){$("#btnQuitar_"+idDiv).show("fade", 500);}, 500);
                            setTimeout(function(){$("#btnOpciones_"+idDiv).show("fade", 500);}, 500);
                            $("#divBorde_" + idDiv).css("background-color", "#E9FFE1");
                            $("#divBorde_" + idDiv).effect("highlight", { color: "#82FA58" }, 500);
                            return;
                        }
                        alert(result);
                    });

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

    }

    async function getEntities(entidad) {
        const response = await fetch('/entidades/'+ entidad)
        .then(res => res.json())
        .then(json => {
            //debugger;
            llenarEntidades(json, `Temas Encontrados Wikidata`);
            $("#divContenedor").show("fade", 500);
        });
    }

});
