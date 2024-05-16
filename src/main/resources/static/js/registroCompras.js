let timeoutId;

const productosAgregados = [];

const ingreso = {};

function realizarBusqueda() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        const input = document.getElementById('nombre').value;
        buscarProductos(input);
    }, 1500); // Espera 3 segundos antes de realizar la búsqueda
}

function realizarBusquedaProveedor() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        const input = document.getElementById('proveedor').value;
        buscarProveedor(input);
    }, 1500); // Espera 3 segundos antes de realizar la búsqueda
}

function limpiar(){
    const input = document.getElementById('nombre');
    input.value = "";
    input.focus();
    document.querySelector('.options-wrapper').style.display = 'none';
}

function buscarProveedor(input) {
    const optionsWrapper = document.querySelector('.options-wrapper-proveedor');
    if (input.trim() === '') {
        document.querySelector('#options2').innerHTML = '';
        optionsWrapper.style.display = 'none';
        return;
    }

    // Realiza una solicitud AJAX para buscar proveedores
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const proveedores = JSON.parse(xhr.responseText);
            console.log("Proveedores:" + proveedores);
            

            const options = document.getElementById('options2');
            mostrarProveedores(options, proveedores, optionsWrapper);
        }
    };

    xhr.open('GET', '/admin/proveedores/buscar-proveedor-api?nombre=' + input, true);
    xhr.send();
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

    xhr.open('GET', '/admin/productos/buscar-productos-api?nombre=' + input, true);
    xhr.send();
}

function calcularTotal(cantidadInput, precioUnitarioInput, totalInput, producto) {
    const cantidad = parseFloat(cantidadInput.value) || 0; // Obtener cantidad (asegurarse de que sea un número)
    const precioUnitario = parseFloat(precioUnitarioInput.value) || 0; // Obtener precio unitario
    const total = cantidad * precioUnitario; // Calcular el total
    
    // Actualizar el campo Total
    totalInput.value = total.toFixed(2); // Mostrar el total con dos decimales

    producto.cantidad = cantidad;
    producto.precioCompraUnitario = precioUnitario;
    producto.total = total;
    console.log(producto);
}

function calcularPrecioUnitario(cantidadInput, totalInput, precioUnitarioInput, producto) {
    const cantidad = parseFloat(cantidadInput.value) || 0; // Obtener cantidad (asegurarse de que sea un número)
    const total = parseFloat(totalInput.value) || 0; // Obtener total
    const precioUnitario = total / cantidad; // Calcular el precio unitario

    // Actualizar el campo Precio Unitario
    precioUnitarioInput.value = precioUnitario.toFixed(2); // Mostrar el precio unitario con dos decimales

    producto.cantidad = cantidad;
    producto.precioCompraUnitario = precioUnitario;
    producto.total = total;
    console.log(producto);
}

function mostrarProveedores(options, proveedores, optionsWrapper) {
    options.innerHTML = '';
    if (proveedores.length > 0) {
        proveedores.forEach(proveedor => {
            const option = document.createElement('div');
            option.classList.add('option');

            // const imgWrapper = document.createElement('div');
            // imgWrapper.classList.add('img-wrapper');
            // const img = document.createElement('img');
            // img.src = proveedor.imagenUrl;
            // img.alt = proveedor.nombre;
            // imgWrapper.appendChild(img);
            // option.appendChild(imgWrapper);

            const textWrapper = document.createElement('div');
            textWrapper.classList.add('text-wrapper');
            const name = document.createElement('span');
            name.classList.add('name');
            name.textContent = proveedor.nombre;

            const screenName = document.createElement('span');
            screenName.classList.add('screen-name');
            screenName.textContent = `${proveedor.ruc}`;
            textWrapper.appendChild(name);
            textWrapper.appendChild(screenName);
            option.appendChild(textWrapper);
            option.addEventListener('click', () => {
                seleccionarProveedor(proveedor);
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
        name.textContent = "No se encontraron proveedores con ese nombre";
        textWrapper.appendChild(name);
        option.appendChild(textWrapper);
        options.appendChild(option);

    }
    optionsWrapper.style.display = 'block';
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
            name.textContent = producto.descripcion;

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

function seleccionarProveedor(proveedor) {
    console.log("Proved", proveedor);
    const proveedorInput = document.getElementById("proveedor");
    proveedorInput.value = proveedor.nombre;
    const rucInput = document.getElementById("ruc");
    rucInput.value = proveedor.ruc;
    ingreso.proveedor = proveedor;
    console.log("Ingreso:", ingreso);
}

// Esta función se llama cuando haces clic en un resultado de búsqueda
function seleccionarProducto(producto) {
    productosAgregados.push(producto);
    console.log(productosAgregados);
    // Aquí asumimos que 'producto' es un objeto que contiene los datos del producto seleccionado
    const opcionesBusqueda = document.querySelector('#options');
    opcionesBusqueda.innerHTML = "";
    const tableBody = document.getElementById("productTableBody");

    // Crear una nueva fila en la tabla
    const newRow = document.createElement("tr");

    // Crear celdas para la descripción y cantidad
    const descripcionCell = document.createElement("td");
    descripcionCell.textContent = producto.descripcion;

    const cantidadCell = document.createElement("td");
    const cantidadInput = document.createElement("input");
    cantidadInput.classList.add("form-control", "form-control-sm");
    cantidadInput.type = "number";
    cantidadInput.value = 1;

    cantidadCell.appendChild(cantidadInput);

    const precioCompraCell = document.createElement("td");
    const precioCompraInput = document.createElement("input");
    precioCompraInput.classList.add("form-control", "form-control-sm");
    precioCompraInput.type = "number";
    precioCompraInput.value = 1;
    precioCompraCell.appendChild(precioCompraInput);

    const totalCell = document.createElement("td");
    const totalInput = document.createElement("input");
    totalInput.classList.add("form-control", "form-control-sm");
    totalInput.type = "number";
    totalInput.value = 1;
    totalCell.appendChild(totalInput);

    const eliminarCell = document.createElement("td");
    const eliminarButton = document.createElement("button");
    eliminarButton.classList.add("btn", "btn-sm", "btn-danger");
    const eliminarIcon = document.createElement("i");
    eliminarIcon.classList.add("bi", "bi-trash");
    eliminarButton.appendChild(eliminarIcon);
    eliminarCell.appendChild(eliminarButton);

    cantidadInput.addEventListener("input", function () {
        calcularTotal(cantidadInput, precioCompraInput, totalInput, producto);
    });

    precioCompraInput.addEventListener("input", function () {
        calcularTotal(cantidadInput, precioCompraInput, totalInput, producto);
    });

    totalInput.addEventListener("input", function () {
        calcularPrecioUnitario(cantidadInput, totalInput, precioCompraInput, producto);
    });

    // Agregar las celdas a la fila
    newRow.appendChild(descripcionCell);
    newRow.appendChild(cantidadCell);
    newRow.appendChild(precioCompraCell);
    newRow.appendChild(totalCell);
    newRow.appendChild(eliminarCell);

    // Agregar la fila a la tabla
    tableBody.appendChild(newRow);
}

document.addEventListener("DOMContentLoaded", function () {
    var guardarIngresoButton = document.getElementById("guarda");
    guardarIngresoButton.addEventListener("click", function () {
        // Otros campos de ingreso aquí

        const numeroDocumento = document.querySelector("#numeroDocumento").value;
        const fechaDocumento = document.querySelector("#fechaDocumento").value;
        console.log("numeroDocumento:", numeroDocumento);
        console.log("fechaDocumento:", fechaDocumento);

        const detalleIngreso = [];
        for (const productoAgregado of productosAgregados) {
            const productoDetalle = {
                productoId: productoAgregado.id,
                descripcionProducto: productoAgregado.descripcion,
                cantidad: productoAgregado.cantidad,
                precioCompraUnitario: productoAgregado.precioCompraUnitario
            }
            detalleIngreso.push(productoDetalle);
        }

        let ingresoData = {
            numeroDocumento: numeroDocumento,
            fechaDocumento: fechaDocumento,
            proveedor: ingreso.proveedor,
            detalleIngreso: detalleIngreso
        }

        console.log("INGRESO DATA:", ingresoData);

        // var ingresoData = {
        //     numeroDocumento: "f-033",
        //     fechaDocumento: "2023-10-10",
        //     proveedor: {
        //       id: "2",
        //       nombre: "proveedor 1",
        //       ruc: "20235050"
        //     },
        //     detalleIngreso: [{
        //         descripcionProducto: "descripcino producto 1",
        //         cantidad: 20,
        //         precioCompraUnitario: 15.2
        //     },{
        //         descripcionProducto: "descripcino producto 2",
        //         cantidad: 60,
        //         precioCompraUnitario: 33.15
        //     }]
        //   }

        // Realizar la solicitud POST utilizando fetch
        fetch("/admin/compras/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ingresoData)
        })
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Error en la solicitud: " + response.status);
            }
        })
        .then(function (data) {
            console.log("Ingreso guardado exitosamente: " + data);
            window.location.href = "/admin/compras";
        })
        .catch(function (error) {
            console.error("Error al guardar el ingreso: " + error.message);
        });
    });
});