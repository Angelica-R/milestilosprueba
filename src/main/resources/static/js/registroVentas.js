let timeoutId;
const productosAgregados = [];
const salida = {};


document.addEventListener("DOMContentLoaded", function () {
    let fechaActual = new Date();
    fechaActual.setUTCHours(fechaActual.getUTCHours() - 5);
    const fechaDocumentInput = document.querySelector('#fechaDocumento');
    fechaDocumentInput.valueAsDate = fechaActual;
});

function realizarBusqueda() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        const input = document.getElementById('nombre').value;
        buscarProductos(input);
    }, 1500);
}

function limpiar(){
    const input = document.getElementById('nombre');
    input.value = "";
    input.focus();
    document.querySelector('.options-wrapper').style.display = 'none';
}

function realizarBusquedaCliente() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        const input = document.getElementById('cliente').value;
        buscarCliente(input);
    }, 1500);
}

function buscarCliente(input) {
    const optionsWrapper = document.querySelector('.options-wrapper-clientes');
    if (input.trim() === '') {
        document.querySelector('#options2').innerHTML = '';
        optionsWrapper.style.display = 'none';
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const clientes = JSON.parse(xhr.responseText);
            console.log("clientes:" + clientes);
            

            const options = document.getElementById('options2');
            mostrarClientes(options, clientes, optionsWrapper);
        }
    };

    xhr.open('GET', '/admin/clientes/buscar-clientes-api?nombre=' + input, true);
    xhr.send();
}

function mostrarClientes(options, clientes, optionsWrapper) {
    options.innerHTML = '';
    if (clientes.length > 0) {
        clientes.forEach(cliente => {
            const option = document.createElement('div');
            option.classList.add('option');

            const textWrapper = document.createElement('div');
            textWrapper.classList.add('text-wrapper');
            const name = document.createElement('span');
            name.classList.add('name');
            name.textContent = cliente.nombre;

            const screenName = document.createElement('span');
            screenName.classList.add('screen-name');
            screenName.textContent = `${cliente.dni}`;
            textWrapper.appendChild(name);
            textWrapper.appendChild(screenName);
            option.appendChild(textWrapper);
            option.addEventListener('click', () => {
                seleccionarCliente(cliente);
                document.getElementById('nombre').value = "";
                optionsWrapper.style.display = 'none';
            });
            options.appendChild(option);
        });
    } else {
        const option = document.createElement('div');
        option.classList.add('option');

        const textWrapper = document.createElement('div');
        textWrapper.classList.add('text-wrapper');
        const name = document.createElement('span');
        name.classList.add('name');
        name.textContent = "No se encontraron clientes con ese nombre";
        textWrapper.appendChild(name);
        option.appendChild(textWrapper);
        options.appendChild(option);

    }
    optionsWrapper.style.display = 'block';
}

function seleccionarCliente(cliente) {
    const clienteInput = document.getElementById("cliente");
    clienteInput.value = cliente.nombre;
    const dniInput = document.getElementById("dni");
    dniInput.value = cliente.dni;
    salida.cliente = cliente;
}

function buscarProductos(input) {
    const optionsWrapper = document.querySelector('.options-wrapper');
    if (input.trim() === '') {
        document.querySelector('#options').innerHTML = '';
        optionsWrapper.style.display = 'none';
        return;
    }

    // Realiza una solicitud AJAX para buscar productos
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const productos = JSON.parse(xhr.responseText);
            console.log("Opciones:" + productos);

            const options = document.getElementById('options');
            mostrarResultados(options, productos, optionsWrapper);
        }
    };

    xhr.open('GET', '/admin/productos/buscar-productos-disponibles-api?nombre=' + input, true);
    xhr.send();
}

function mostrarResultados(options, productos, optionsWrapper) {
    options.innerHTML = '';
    if (productos.length > 0) {
        productos.forEach(producto => {
            const option = document.createElement('div');
            option.classList.add('option');

            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('img-wrapper');
            const img = document.createElement('img');
            img.src = producto.imagenUrl;
            img.alt = producto.descripcion;
            imgWrapper.appendChild(img);
            option.appendChild(imgWrapper);

            const textWrapper = document.createElement('div');
            textWrapper.classList.add('text-wrapper');
            const name = document.createElement('span');
            name.classList.add('name');
            name.textContent = producto.descripcion + ` | Stock: ${producto.stock}`;

            const screenName = document.createElement('span');
            screenName.classList.add('screen-name');
            screenName.textContent = `@${producto.marca}`;
            textWrapper.appendChild(name);
            textWrapper.appendChild(screenName);
            option.appendChild(textWrapper);
            option.addEventListener('click', () => {
                seleccionarProducto(producto);
                document.getElementById('nombre').value = "";
                optionsWrapper.style.display = 'none';
            });
            options.appendChild(option);
        });
    } else {
        const option = document.createElement('div');
        option.classList.add('option');

        const textWrapper = document.createElement('div');
        textWrapper.classList.add('text-wrapper');
        const name = document.createElement('span');
        name.classList.add('name');
        name.textContent = "No se encontraron productos con ese nombre";
        textWrapper.appendChild(name);
        option.appendChild(textWrapper);
        options.appendChild(option);

    }
    optionsWrapper.style.display = 'block';
}

function seleccionarProducto(producto) {
    productosAgregados.push(producto);
    console.log(productosAgregados);
    
    const opcionesBusqueda = document.querySelector('#options');
    opcionesBusqueda.innerHTML = "";
    const tableBody = document.getElementById("productTableBody");

    const newRow = document.createElement("tr");

    const descripcionCell = document.createElement("td");
    descripcionCell.textContent = producto.descripcion;

    const stockCell = document.createElement("td");
    stockCell.textContent = producto.stock;

    const cantidadCell = document.createElement("td");
    const cantidadInput = document.createElement("input");
    cantidadInput.classList.add("form-control", "form-control-sm");
    cantidadInput.type = "number";
    cantidadInput.value = 1;
    cantidadInput.min = 1;
    cantidadInput.max = producto.stock;

    cantidadCell.appendChild(cantidadInput);

    const precioVentaCell = document.createElement("td");
    const precioVentaInput = document.createElement("input");
    precioVentaInput.classList.add("form-control", "form-control-sm");
    precioVentaInput.type = "number";
    precioVentaInput.value = producto.precioVenta;
    precioVentaCell.appendChild(precioVentaInput);

    const totalCell = document.createElement("td");
    const totalInput = document.createElement("input");
    totalInput.classList.add("form-control", "form-control-sm");
    totalInput.type = "number";
    totalInput.value = producto.precioVenta;
    totalCell.appendChild(totalInput);

    const eliminarCell = document.createElement("td");
    const eliminarButton = document.createElement("button");
    eliminarButton.classList.add("btn", "btn-sm", "btn-danger");
    eliminarButton.onclick = function() {
        eliminarButton.closest('tr').remove();
        let indiceAEliminar = productosAgregados.findIndex(P => P === producto);
        if (indiceAEliminar !== -1) {
            productosAgregados.splice(indiceAEliminar, 1);
        }
        console.log(productosAgregados);
    }
    const eliminarIcon = document.createElement("i");
    eliminarIcon.classList.add("bi", "bi-trash");
    eliminarButton.appendChild(eliminarIcon);
    eliminarCell.appendChild(eliminarButton);
    calcularTotal(cantidadInput, precioVentaInput, totalInput, producto);

    cantidadInput.addEventListener("input", function () {
        calcularTotal(cantidadInput, precioVentaInput, totalInput, producto);
    });

    precioVentaInput.addEventListener("input", function () {
        calcularTotal(cantidadInput, precioVentaInput, totalInput, producto);
    });

    totalInput.addEventListener("input", function () {
        calcularPrecioUnitario(cantidadInput, totalInput, precioVentaInput, producto);
    });

    // Agregar las celdas a la fila
    newRow.appendChild(descripcionCell);
    newRow.appendChild(stockCell);
    newRow.appendChild(cantidadCell);
    newRow.appendChild(precioVentaCell);
    newRow.appendChild(totalCell);
    newRow.appendChild(eliminarCell);

    // Agregar la fila a la tabla
    tableBody.appendChild(newRow);
}

function calcularTotal(cantidadInput, precioUnitarioInput, totalInput, producto) {
    const cantidad = parseFloat(cantidadInput.value) || 0; // Obtener cantidad (asegurarse de que sea un número)
    const precioUnitario = parseFloat(precioUnitarioInput.value) || 0; // Obtener precio unitario
    const total = cantidad * precioUnitario; // Calcular el total
    
    // Actualizar el campo Total
    totalInput.value = total.toFixed(2); // Mostrar el total con dos decimales

    producto.cantidad = cantidad;
    producto.precioVentaUnitario = precioUnitario;
    producto.total = total;
    console.log(producto);
}

function calcularPrecioUnitario(cantidadInput, totalInput, precioUnitarioInput, producto) {
    const cantidad = parseFloat(cantidadInput.value) || 0; // Obtener cantidad (asegurarse de que sea un número)
    const total = parseFloat(totalInput.value) || 0; // Obtener total
    const precioUnitario = total / cantidad; // Calcular el precio unitario

    precioUnitarioInput.value = precioUnitario.toFixed(2); // Mostrar el precio unitario con dos decimales

    producto.cantidad = cantidad;
    producto.precioVentaUnitario = precioUnitario;
    producto.total = total;
    console.log(producto);
}

document.addEventListener("DOMContentLoaded", function () {
    var guardarVentaButton = document.getElementById("guardarVenta");
    guardarVentaButton.addEventListener("click", function () {
        const numeroDocumento = document.querySelector("#numeroDocumento").value;
        const fechaDocumento = document.querySelector("#fechaDocumento").value;
        console.log("numeroDocumento:", numeroDocumento);
        console.log("fechaDocumento:", fechaDocumento);
        if(numeroDocumento == "") {
            alert("Ingrese el numero de documento de la venta");
            document.querySelector("#numeroDocumento").focus();
            return;
        }
        if(salida.cliente == null) {
            alert("Debe ingresar un cliente");
            document.querySelector("#cliente").focus();
            return;
        }

        if(productosAgregados.length == 0) {
            alert("Debe registrar al menos un producto");
            return;
        }

        const detalleSalida = [];
        for (const productoAgregado of productosAgregados) {
            const productoDetalle = {
                productoId: productoAgregado.id,
                descripcionProducto: productoAgregado.descripcion,
                cantidad: productoAgregado.cantidad,
                precioVentaUnitario: productoAgregado.precioVentaUnitario
            }
            detalleSalida.push(productoDetalle);
        }

        let salidaData = {
            numeroDocumento: numeroDocumento,
            fechaDocumento: fechaDocumento,
            cliente: salida.cliente,
            detalleSalida: detalleSalida
        }

        console.log("SALIDA DATA:", salidaData);

        // Realizar la solicitud POST utilizando fetch
        fetch("/admin/ventas/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(salidaData)
        })
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Error en la solicitud: " + response.status);
            }
        })
        .then(function (data) {
            console.log("Salida guardada exitosamente: " + data);
            window.location.href = "/admin/ventas";
        })
        .catch(function (error) {
            console.error("Error al guardar la salida: " + error.message);
        });
    });
});