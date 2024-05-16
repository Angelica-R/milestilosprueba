class Carrito {
    constructor() {
        this.idPedido = this.obtenerIdPedidoDesdeLocalStorage();
        this.informacionDelUsuario = this.obtenerInformacionDelUsuarioDesdeLocalStorage();
        this.items = this.obtenerCarritoDesdeLocalStorage();
    }

    guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    guardarInformacionDelUsuarioEnLocalStorage() {
        localStorage.setItem('informacionDelUsuario', JSON.stringify(this.informacionDelUsuario));
    }

    guardarIdPedidoEnLocalStorage(){
        localStorage.setItem('idPedido', JSON.stringify(this.idPedido));
    }

    obtenerIdPedidoDesdeLocalStorage() {
        const idPedido = localStorage.getItem('idPedido');
        return idPedido ? JSON.parse(idPedido) : 0;
    }

    obtenerCarritoDesdeLocalStorage() {
        const carrito = localStorage.getItem('carrito');
        return carrito ? JSON.parse(carrito) : [];
    }

    obtenerInformacionDelUsuarioDesdeLocalStorage() {
        const informacionDelUsuario = localStorage.getItem('informacionDelUsuario');
        return informacionDelUsuario ? JSON.parse(informacionDelUsuario) : {};
    }

    establecerInformacionUsuario(informacionUsuarioObject) {
        this.informacionDelUsuario = informacionUsuarioObject;
        this.guardarInformacionDelUsuarioEnLocalStorage();
    }

    establecerIdPedido(idPedido){
        this.idPedido = idPedido;
        this.guardarIdPedidoEnLocalStorage();
    }

    getTotal(){
        let total = 0;
        this.items.forEach(function (item) {
            total += parseInt(item.cantidad) * parseInt(item.precioVenta);
        })
        return total;
    }

    agregarProducto(nuevoProducto) {
        const productoExistenteIndex = this.items.findIndex(function(producto) {
            return producto.idProducto === nuevoProducto.idProducto;
        });
        if (productoExistenteIndex !== -1) {
            this.items[productoExistenteIndex].cantidad = parseInt(this.items[productoExistenteIndex].cantidad) + parseInt(nuevoProducto.cantidad);
        } else {
            this.items.push(nuevoProducto);
        }
        this.guardarCarritoEnLocalStorage();
    }

    eliminarProducto(index) {
        this.items.splice(index, 1);
        this.guardarCarritoEnLocalStorage();
    }

    eliminarCarritoDelLocalStorage() {
        this.items = [];
        localStorage.removeItem('carrito');
        localStorage.removeItem('idPedido')
        localStorage.removeItem('informacionDelUsuario')
    }

    obtenerCarrito() {
        return this.items;
    }
    
    obtenerInformacionUsuario() {
        return this.informacionDelUsuario;
    }
}

export default Carrito;