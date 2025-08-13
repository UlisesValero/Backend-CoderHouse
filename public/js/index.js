document.addEventListener("DOMContentLoaded", () => {
    const socket = io()

    let cid = 0;
    const botonCarrito = document.getElementById('boton-carrito');

    socket.emit('getCart');

    socket.on('cart', (cartId) => {
        cid = cartId;
        if (!botonCarrito) return;

        botonCarrito.style.display = cid ? 'block' : 'none';
        if (cid) botonCarrito.href = `/carts/${cid}`;
    });

    // Funciones para los botones
    window.addProductToCart = async function(pid) {
        const res = await fetch(`/api/carts/${cid}/products/${pid}`, { method: 'POST' });
        const data = await res.json();
        cid = data.payload?._id || cid;
        socket.emit('postCart', cid);
        alert('Producto agregado al carrito');
    }

    window.deleteCart = async function() {
        await fetch(`/api/carts/${cid}`, { method: 'DELETE' });
        alert('Carrito vaciado');
        window.location.href = '/';
    }

    window.deleteFromCart = async function(pid) {
        await fetch(`/api/carts/${cid}/products/${pid}`, { method: 'DELETE' });
        alert('Producto eliminado');
        const productElem = document.getElementById(`cart-product-${pid}`);
        if (productElem) productElem.remove();
    }
});
