const fs = require('fs')

class CartsManager {

    constructor(route) {
        this.path = route
    }

    addOrder() {
        let stringData = fs.readFileSync(this.path, 'utf8')
        let parsedData = JSON.parse(stringData)

        if (!parsedData.order) parsedData.order = []
        const order = parsedData.order

        let newOrder = {
            id: order.length + 1,
            products: []
        }
        order.push(newOrder)


        fs.writeFileSync(this.path, JSON.stringify(parsedData))
    }

    addProductToCart(cid, pid) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)

        const cart = parsedData.order.find(o => o.id === parseInt(cid))
        const productInCart = cart.products.find(p => p.id === pid)

        if (productInCart) {
            productInCart.quantity += 1
        } else {
            cart.products.push({ id: pid, quantity: 1 })
        }


        fs.writeFileSync(this.path, JSON.stringify(parsedData))
    }

    searchOrderById(id) {
        let stringData = fs.readFileSync(this.path, 'utf8')
        let parsedData = JSON.parse(stringData)

        let idFiltrado = parsedData.order.find(o => o.id === Number(id))
        console.log(idFiltrado)
        return idFiltrado
    }
}


module.exports = CartsManager
