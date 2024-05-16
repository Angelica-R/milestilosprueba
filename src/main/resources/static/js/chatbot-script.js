import Carrito from './Carrito.js';

const miCarrito = new Carrito();

function updateRealTime() {
    const userTimeText = document.getElementById('real-time');
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Formato de la hora
    const formattedTime = `${currentHour < 10 ? '0' : ''}${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`;
    
    // Establecer la fecha como "Hoy"
    const currentDate = "Hoy";

    // Actualizar el contenido del elemento con la hora y la fecha
    userTimeText.textContent = `${currentDate}, ${formattedTime}`;
}

// Llama a la función para mostrar la hora/fecha en tiempo real al cargar la página
updateRealTime();

// Actualiza la hora/fecha cada minuto (puedes ajustar el intervalo según tus necesidades)
setInterval(updateRealTime, 60000);

function aniadirMensaje(mensaje, clasesCss, cuadrosDeVenta = false, informacionProducto = null, urlImagen = null, cuadroClienteInformacion = false) {
    const chatMessageDiv = document.getElementById("chat-messages");

    const messageUserDiv = document.createElement('div');
    messageUserDiv.classList.add('message', `${clasesCss}`);

    const userIconDiv = document.createElement('div');
    userIconDiv.classList.add(`${clasesCss}-icon`);
    

    const userIcon = document.createElement('i');
    userIcon.classList.add('fas', `fa-${clasesCss}`);
    userIconDiv.appendChild(userIcon);

    const messageContentUserDiv = document.createElement('div');
    messageContentUserDiv.classList.add(`message-content-${clasesCss}`);
    messageContentUserDiv.textContent = mensaje;

    if(urlImagen != null) {
        const imagenElemento = document.createElement("img");
        imagenElemento.style.maxWidth = '150px'
        imagenElemento.src = urlImagen;
        messageContentUserDiv.appendChild(imagenElemento);
    }

    if(cuadrosDeVenta == true) {
        const cuadroDeVentaDiv = document.createElement('div');
        cuadroDeVentaDiv.classList.add('input-group');
        const cantidadInput = document.createElement("input");
        cantidadInput.classList.add('form-control', 'form-control-sm');
        cantidadInput.type = "number";
        cantidadInput.value = "1";
        cantidadInput.min = "1";
        cantidadInput.step = "1";

        const agregarBoton = document.createElement("button");
        agregarBoton.textContent = "Add";
        agregarBoton.classList.add('btn', 'btn-sm', 'btn-success');
        agregarBoton.onclick = function () {
            var cantidad = cantidadInput.value;
            if (!isNaN(cantidad) && cantidad !== "") {
                console.log("Cantidad ingresada: " + cantidad);
                const detalleVenta = {
                    idProducto: informacionProducto.id,
                    codigo: informacionProducto.codigo,
                    descripcion: informacionProducto.descripcion,
                    cantidad: cantidad,
                    precioVenta: informacionProducto.precioVenta
                }
                miCarrito.agregarProducto(detalleVenta)
                console.log(miCarrito);
                aniadirMensaje(`Se ha agregado ${cantidad} unidades del producto ${informacionProducto.descripcion}!!`, 'robot');
                mostrarCarritoEnChat('robot', miCarrito.obtenerCarrito());
                document.querySelector('#mostrarCarrito').disabled = false;
                document.querySelector('#eliminarCarrito').disabled = false;
                let cantidadDeItemsEnElCarrito = miCarrito.obtenerCarrito().length;
                let mostrarCarritoButton = document.querySelector('#mostrarCarrito');
                mostrarCarritoButton.setAttribute('data-bs-title', `${cantidadDeItemsEnElCarrito} productos`);
                new bootstrap.Tooltip(mostrarCarritoButton)
            } else {
                alert("Por favor, ingrese una cantidad válida.");
            }
        };

        cuadroDeVentaDiv.appendChild(cantidadInput);
        cuadroDeVentaDiv.appendChild(agregarBoton);

        messageContentUserDiv.appendChild(cuadroDeVentaDiv);
    }

    if(cuadroClienteInformacion == true) {
        const cuadroClienteInformacionDiv = document.createElement('div');
        
        const dniClienteInput = document.createElement("input");
        dniClienteInput.type = "text";
        dniClienteInput.placeholder = "Dni";

        const nombreClienteInput = document.createElement("input");
        nombreClienteInput.type = "text";
        nombreClienteInput.placeholder = "Su nombre completo";
        
        const telefonoClienteInput = document.createElement("input");
        telefonoClienteInput.type = "text";
        telefonoClienteInput.placeholder = "Su telefono para contacto";

        const direccionClienteInput = document.createElement("input");
        direccionClienteInput.type = "text";
        direccionClienteInput.placeholder = "Su dirección en caso de delivery (opcional)";
        
        const informacionClienteButton = document.createElement('button');
        informacionClienteButton.textContent = "enviar";
        informacionClienteButton.onclick = function () {
            const dniCliente = dniClienteInput.value;
            const nombreCliente = nombreClienteInput.value;
            const telefonoCliente = telefonoClienteInput.value;
            const direccionCliente = direccionClienteInput.value;
            if (nombreCliente !== "" & telefonoCliente !== "") {
                const informacionUsuarioObject = {
                    dni: dniCliente,
                    nombre: nombreCliente,
                    telefono: telefonoCliente,
                    direccion: direccionCliente
                }
                miCarrito.establecerInformacionUsuario(informacionUsuarioObject);
                console.log(miCarrito);
                //Grabar pedido en la base de datos..
                fetch(`/ventas/registrar-cliente-pedido?pedidoId=${miCarrito.obtenerIdPedidoDesdeLocalStorage()}`,{
                    method: 'POST',
                    body: JSON.stringify(informacionUsuarioObject),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Error en la solicitud: " + response.status);
                    }
                })
                .then(function (clienteRegistradoAPedido) {
                    console.log("Cliente registrado a pedido exitosamente: ", clienteRegistradoAPedido);
                })
                .catch(function (error) {
                    console.error("Error al guardar el ingreso: " + error.message);
                });
            } else {
                alert("Por favor, ingrese todos los campos.");
            }
        };

        cuadroClienteInformacionDiv.appendChild(dniClienteInput);
        cuadroClienteInformacionDiv.appendChild(nombreClienteInput);
        cuadroClienteInformacionDiv.appendChild(telefonoClienteInput);
        cuadroClienteInformacionDiv.appendChild(direccionClienteInput);
        cuadroClienteInformacionDiv.appendChild(informacionClienteButton);

        messageContentUserDiv.appendChild(cuadroClienteInformacionDiv);
    }


    messageUserDiv.appendChild(userIconDiv);
    messageUserDiv.appendChild(messageContentUserDiv);

    

    chatMessageDiv.appendChild(messageUserDiv);
    chatMessageDiv.scrollTop = chatMessageDiv.scrollHeight;
}


function mostrarCarritoEnChat(clasesCss, productos){
    const chatMessageDiv = document.getElementById("chat-messages");

    const messageUserDiv = document.createElement('div');
    messageUserDiv.classList.add('message', `${clasesCss}`);

    const userIconDiv = document.createElement('div');
    userIconDiv.classList.add(`${clasesCss}-icon`);
    

    const userIcon = document.createElement('i');
    userIcon.classList.add('fas', `fa-${clasesCss}`);
    userIconDiv.appendChild(userIcon);

    const messageContentUserDiv = document.createElement('div');
    messageContentUserDiv.classList.add(`message-content-${clasesCss}`);
    const tablaProductos = generarTablaResumen(productos);
    messageContentUserDiv.appendChild(tablaProductos);

    const finalizarDiv = document.createElement('div');
    const buttonFinalizarCompra = document.createElement('button');
    buttonFinalizarCompra.textContent = "Finalizar Compra";
    buttonFinalizarCompra.classList.add('btn', 'btn-sm', 'btn-success');
    buttonFinalizarCompra.onclick = function () {

        let sumaTotal = productos.reduce((total, producto) => {
            return total + (producto.cantidad * producto.precioVenta);
        }, 0);

        const detalleSalida = [];
        for (const productoAgregado of miCarrito.obtenerCarrito()) {
            const productoDetalle = {
                productoId: productoAgregado.idProducto,
                descripcionProducto: productoAgregado.descripcion,
                cantidad: productoAgregado.cantidad,
                precioVentaUnitario: productoAgregado.precioVenta
            }
            detalleSalida.push(productoDetalle);
        }

        let salidaData = {
            // numeroDocumento: numeroDocumento,
            // fechaDocumento: fechaDocumento,
            // proveedor: ingreso.proveedor,
            detalleSalida: detalleSalida
        }

        //Grabar pedido en la base de datos..
        fetch('/ventas/registrar-pedido',{
            method: 'POST',
            body: JSON.stringify(salidaData),
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error en la solicitud: " + response.status);
            }
        })
        .then(function (pedidoRegistrado) {
            miCarrito.establecerIdPedido(pedidoRegistrado.id);
            console.log("Salida guardada exitosamente: ", pedidoRegistrado);
        })
        .catch(function (error) {
            console.error("Error al guardar el ingreso: " + error.message);
        });
        aniadirMensaje('Sus productos han sido separados y estan disponibles. Dispone de 1 hora para efectuar el pago. Despues de ese tiempo no aseguramos disponibilidad de su pedido.', 'robot', false, null, null);
        aniadirMensaje(`Escanee el codigo qr pagar pagar por Yape. Total S/.: ${sumaTotal.toFixed(2)}`, 'robot', false, null, yapeQrUrlImagen)
        aniadirMensaje(`Por favor rellene los siguientes campos para contactarnos con usted`, 'robot', false, null, null, true);
    };
    finalizarDiv.appendChild(buttonFinalizarCompra);
    messageContentUserDiv.appendChild(finalizarDiv);

    messageUserDiv.appendChild(userIconDiv);
    messageUserDiv.appendChild(messageContentUserDiv);

    

    chatMessageDiv.appendChild(messageUserDiv);
    chatMessageDiv.scrollTop = chatMessageDiv.scrollHeight;
}

function generarTablaResumen(productos){
    // Crear la tabla
    var tabla = document.createElement('table');
    tabla.classList.add('table', 'table-sm', 'table-striped');

    // Crear la fila de encabezado
    var encabezado = tabla.createTHead();
    var filaEncabezado = encabezado.insertRow();
    var encabezados = ['Descripción', 'Cantidad', 'Precio Venta', 'Total', ''];

    // Agregar encabezados a la fila de encabezado
    encabezados.forEach(function (encabezado) {
        var th = document.createElement('th');
        th.textContent = encabezado;
        filaEncabezado.appendChild(th);
    });

    // Crear el cuerpo de la tabla
    var cuerpoTabla = tabla.createTBody();

    // Iterar sobre los datos y crear filas
    productos.forEach(function (producto, index) {
        var fila = cuerpoTabla.insertRow();

        // Crear celdas y asignar valores
        var celdaDescripcion = fila.insertCell(0);
        celdaDescripcion.textContent = producto.descripcion;

        var celdaCantidad = fila.insertCell(1);
        celdaCantidad.textContent = producto.cantidad;

        var celdaPrecioVenta = fila.insertCell(2);
        celdaPrecioVenta.textContent = producto.precioVenta.toFixed(2);

        var celdaPrecioVentaTotalFila = fila.insertCell(3);
        celdaPrecioVentaTotalFila.textContent = (producto.precioVenta * producto.cantidad).toFixed(2);

        var celdaEliminarProducto = fila.insertCell(4);
        const eliminarProductoButton = document.createElement('button');
        eliminarProductoButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        eliminarProductoButton.classList.add('btn', 'btn-sm', 'btn-danger');
        eliminarProductoButton.onclick = function () {
            console.log("eliminar producto");
            miCarrito.eliminarProducto(index);
            const productosDelCarrito = miCarrito.obtenerCarrito();
            if(productosDelCarrito.length == 0){
                listaProductosCartCard.innerHTML = `
                    <div class="alert alert-warning">No hay productos añadidos aún</div>
                `;
                document.getElementById("enviarCompra").disabled = true;
            } else {
                const listaProductosTable = generarTablaResumen(productosDelCarrito);
                listaProductosCartCard.innerHTML = "";
                listaProductosCartCard.appendChild(listaProductosTable);
            }
            const subTotalTd = document.getElementById("subTotalTd");
            const igvTd = document.getElementById("igvTd");
            const totalTd = document.getElementById("totalTd");
            const total = miCarrito.getTotal();
            subTotalTd.textContent = (total / 1.18).toFixed(2);
            igvTd.textContent = (total * 0.18).toFixed(2);
            totalTd.textContent = total.toFixed(2);
            const cartIcon = document.getElementById("cartIcon");
            cartIcon.innerHTML = `
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="position-absolute top-0 start-90 badge rounded-pill bg-success">
                ${miCarrito.obtenerCarrito().length}
                </span>
            `;
        }
        celdaEliminarProducto.appendChild(eliminarProductoButton);
    });
    return tabla;
}

function mostrarMiniatura() {
    var input = document.getElementById('image-upload');
    var miniaturaContainer = document.getElementById('miniatura');

    // Limpiar la miniatura existente
    miniaturaContainer.innerHTML = '';

    // Verificar si se seleccionó un archivo
    if (input.files && input.files[0]) {
        const selectImageIcon = document.querySelector(".fa-image");
        selectImageIcon.style.display = "none";
        const lector = new FileReader();

        lector.onload = function (e) {
            // Crear una miniatura de la imagen
            var miniatura = document.createElement('img');
            miniatura.src = e.target.result;
            miniatura.style.maxHeight = '20px'; // Establecer un tamaño máximo
            miniaturaContainer.appendChild(miniatura);
        };

        // Leer el contenido del archivo como una URL de datos (data URL)
        lector.readAsDataURL(input.files[0]);
    }
}

document.addEventListener('DOMContentLoaded', function () {

    const mostrarCarritoButton = document.querySelector('#mostrarCarrito');

    const cartIcon = document.getElementById("cartIcon");
    cartIcon.innerHTML = `
        <i class="fa-solid fa-cart-shopping"></i>
        <span class="position-absolute top-0 start-90 badge rounded-pill bg-success">
        ${miCarrito.obtenerCarrito().length}
        </span>
    `;
    const idPedidoRegistrado = document.getElementById("idPedidoRegistrado");
    if(idPedidoRegistrado != null) {
        if(miCarrito.obtenerIdPedidoDesdeLocalStorage() != 0) {
            idPedidoRegistrado.textContent = `Su pedido ha sido registrado, su código de seguimiento es: ${miCarrito.obtenerIdPedidoDesdeLocalStorage()}`;
            document.getElementById("enviarCompra").disabled = true;
        }
    
        if(miCarrito.obtenerCarrito().length == 0){
            document.getElementById("enviarCompra").disabled = true;
        }
    }
  
    
    mostrarCarritoButton.addEventListener('click', function() {
        mostrarCarritoEnChat('robot', miCarrito.obtenerCarrito())
    });
    const eliminarCarritoButton = document.querySelector('#eliminarCarrito');
    eliminarCarritoButton.addEventListener('click', function() {
        
        const confirmaEliminacion = window.confirm("¿Estás seguro de que deseas limpiar todo el carrito de compras?");

        if (confirmaEliminacion) {
            document.querySelector('#mostrarCarrito').disabled = true;
            eliminarCarritoButton.disabled = true;
            miCarrito.eliminarCarritoDelLocalStorage();
        }
    });

    let cantidadDeItemsEnElCarrito = miCarrito.obtenerCarrito().length;
    mostrarCarritoButton.setAttribute('data-bs-title', `${cantidadDeItemsEnElCarrito} productos`);
    new bootstrap.Tooltip(mostrarCarritoButton)
    if(cantidadDeItemsEnElCarrito == 0) {
        mostrarCarritoButton.disabled = true;
        eliminarCarritoButton.disabled = true;
    }


    const fileInput = document.getElementById('image-upload');
    fileInput.addEventListener('change', mostrarMiniatura);
    const uploadButton = document.getElementById('send-button');
    const mensajeInput = document.getElementById('mensajeInput');

    const urlApiFlask = "https://5000-jeackory1-milestilos-6poa9o2tag8.ws-us106.gitpod.io"

    uploadButton.addEventListener('click', function () {
        const file = fileInput.files[0];
        const mensaje = mensajeInput.value;
        console.log("MENSAJE:", mensaje);

        if (!file) {
            aniadirMensaje(mensaje, 'user');
            const data = {
                mensaje: mensaje
            };

            mensajeInput.value = '';
            mensajeInput.focus();
            
            fetch(`${urlApiFlask}/chat`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Manejar la respuesta del servidor
                console.log('Respuesta del servidor:', data.response);
                aniadirMensaje(data.response, 'robot');

            })
            .catch(error => {
                console.error('Error:', error);
            });
            return;
        }

        const lector = new FileReader();
        
        document.getElementById('miniatura').innerHTML = '';
        document.querySelector(".fa-image").style.display = "block";

        lector.onload = function (e) {
            aniadirMensaje('', 'user', false, null, e.target.result);
        };
        // Leer el contenido del archivo como una URL de datos (data URL)
        lector.readAsDataURL(fileInput.files[0]);


        const formData = new FormData();
        formData.append('file', file);

        fetch(`${urlApiFlask}/upload`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log("DATA::", data);
                //desde aqui se llamara a un endpoint de la pagina web en Java
                const urlPeticion = "/productos/buscar-producto-codigo?codigo=" + data.etiqueta;
                console.log(urlPeticion)
                fetch(urlPeticion)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Error en la solicitud: " + response.status);
                    }
                })
                .then(function (informacionProducto) {
                    console.log(informacionProducto);
                    const mensaje = `El producto ${informacionProducto.descripcion} tiene un precio de: S/. ${informacionProducto.precioVenta.toFixed(2)}`;
                    aniadirMensaje(mensaje, 'robot', true, informacionProducto);
                })
                .catch(function (error) {
                    console.error("Error al solicitar informacion del producto: " + error.message);
                });
                

                
                fileInput.value = '';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    const listaProductosCartCard = document.querySelector('#listaProductosCartCard');
    if(listaProductosCartCard != null) {
        const productosDelCarrito = miCarrito.obtenerCarrito();
        const subTotalTd = document.getElementById("subTotalTd");
        const igvTd = document.getElementById("igvTd");
        const totalTd = document.getElementById("totalTd");
        if(productosDelCarrito.length == 0){
            listaProductosCartCard.innerHTML = `
                <div class="alert alert-warning">No hay productos añadidos aún</div>
            `;
            subTotalTd.textContent = "0.00";
            igvTd.textContent = "0.00";
            totalTd.textContent = "0.00";
        } else {
            const listaProductosTable = generarTablaResumen(productosDelCarrito);
            listaProductosCartCard.appendChild(listaProductosTable);
            const total = miCarrito.getTotal();
            subTotalTd.textContent = (total / 1.18).toFixed(2);
            igvTd.textContent = (total * 0.18).toFixed(2);
            totalTd.textContent = total.toFixed(2);
        }
        
    }

    var botones = document.getElementsByClassName("btn-buy");

    for (var i = 0; i < botones.length; i++) {
      botones[i].addEventListener("click", function(event) {
        const id = this.getAttribute("data-product-id");
        agregarProductoAlCarrito(event, id);
      });
    }
});

function agregarProductoAlCarrito(event, idProducto) {
    const cantidad = event.target.parentNode.querySelector('input[type="number"]').value;
    var options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      };
      
    fetch(`/productos/${idProducto}`, options)
        .then(response => {
          if (!response.ok) {
            throw new Error('Hubo un problema al realizar la solicitud.');
          }
          return response.json();
        })
        .then(informacionProducto => {
            const detalleVenta = {
                idProducto: informacionProducto.id,
                codigo: informacionProducto.codigo,
                descripcion: informacionProducto.descripcion,
                cantidad: cantidad,
                precioVenta: informacionProducto.precioVenta
            }
            miCarrito.agregarProducto(detalleVenta);
            const cartIcon = document.getElementById("cartIcon");
            cartIcon.innerHTML = `
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="position-absolute top-0 start-90 badge rounded-pill bg-success">
                ${miCarrito.obtenerCarrito().length}
                </span>
            `;
            // const toastTrigger = document.getElementById('liveToastBtn')
            const toastBodyContentDiv = document.getElementById("toastBodyContentDiv");
            toastBodyContentDiv.textContent = `Ha añadido ${cantidad} ${informacionProducto.descripcion}`;
            const toastLiveExample = document.getElementById('liveToast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();

            // if (toastTrigger) {
            // toastTrigger.addEventListener('click', () => {
            // })
            // }
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
   
    console.log(miCarrito);
}

const enviarCompraButton = document.getElementById("enviarCompra");
if(enviarCompraButton != null) {
    enviarCompraButton.onclick = function() {
        const dniCliente = document.getElementById("dniCliente").value;
        const nombreCliente = document.getElementById("nombreCliente").value;
        const telefonoCliente = document.getElementById("telefonoCliente").value;
        const direccionCliente = document.getElementById("direccionCliente").value;
        if (nombreCliente !== "" & telefonoCliente !== "") {
            const detalleSalida = [];
            for (const productoAgregado of miCarrito.obtenerCarrito()) {
                const productoDetalle = {
                    productoId: productoAgregado.idProducto,
                    descripcionProducto: productoAgregado.descripcion,
                    cantidad: productoAgregado.cantidad,
                    precioVentaUnitario: productoAgregado.precioVenta
                }
                detalleSalida.push(productoDetalle);
            }
    
            let salidaData = {
                detalleSalida: detalleSalida
            }
    
            //Grabar pedido en la base de datos..
            fetch('/ventas/registrar-pedido',{
                method: 'POST',
                body: JSON.stringify(salidaData),
                headers: {
                'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error en la solicitud: " + response.status);
                }
            })
            .then(function (pedidoRegistrado) {
                miCarrito.establecerIdPedido(pedidoRegistrado.id);
                
                const informacionUsuarioObject = {
                    dni: dniCliente,
                    nombre: nombreCliente,
                    telefono: telefonoCliente,
                    direccion: direccionCliente
                }
                miCarrito.establecerInformacionUsuario(informacionUsuarioObject);
                console.log(miCarrito);
                fetch(`/ventas/registrar-cliente-pedido?pedidoId=${miCarrito.obtenerIdPedidoDesdeLocalStorage()}`,{
                    method: 'POST',
                    body: JSON.stringify(informacionUsuarioObject),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Error en la solicitud: " + response.status);
                    }
                })
                .then(function (clienteRegistradoAPedido) {
                    console.log("Cliente registrado a pedido exitosamente: ", clienteRegistradoAPedido);
                    location.reload();
                })
                .catch(function (error) {
                    console.error("Error al guardar el ingreso: " + error.message);
                });
     
            })
            .catch(function (error) {
                console.error("Error al guardar el ingreso: " + error.message);
            });
        } else {
            alert("Por favor, ingrese al menos el nombre y el telefono para contactarnos con usted..");
            return;
        }
        
    };
}

const limpiarCarritoCompras = document.getElementById("limpiarCarritoCompras");
if(limpiarCarritoCompras != null) {
    limpiarCarritoCompras.onclick = function () {
        miCarrito.eliminarCarritoDelLocalStorage();
        location.reload();
    }
}