document.addEventListener("DOMContentLoaded", () => {
    const socket = io()
    const URL = 'http://localhost:8080/api'


    let cid = 0
    const botonCarrito = document.getElementById('boton-carrito');

    socket.emit('getCart');

    socket.on('cart', (cartId) => {
        cid = cartId;
        if (!botonCarrito) return;

        botonCarrito.style.display = cid && !window.location.href.includes('/carts') ? 'block' : 'none';
        if (cid) botonCarrito.href = `/carts/${cid}`
    });

    // Funciones para los botones
    window.addProductToCart = async function(pid) {
        const res = await fetch(URL+`/carts/${cid}/products/${pid}`, { method: 'POST' });
        const data = await res.json()
        cid = data._id || cid
        socket.emit('postCart', cid)
        alert('Producto agregado al carrito')
    }

    window.deleteCart = async function() {
        await fetch(URL+`/carts/${cid}`, { method: 'DELETE' })
        alert('Carrito vaciado')
        window.location.href = '/'
    }

    window.deleteFromCart = async function(pid) {
        await fetch(URL+`/carts/${cid}/products/${pid}`, { method: 'DELETE' })
        alert('Producto eliminado')
        const productElem = document.getElementById(`cart-product-${pid}`)
        if (productElem) productElem.remove()
    }
});
