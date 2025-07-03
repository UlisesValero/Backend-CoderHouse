const fs = require('fs');

class ProductManager {

    constructor(route) {
        this.path = route
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        let stringData = fs.readFileSync(this.path, 'utf8')
        let parsedData = JSON.parse(stringData)

        if (!parsedData.products) parsedData.products = []
        const products = parsedData.products

        const newProduct = {
            id: products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        products.push(newProduct)

        fs.writeFileSync(this.path, JSON.stringify(parsedData))
    }

    getProducts() {
        // en formato string
        const stringData = fs.readFileSync(this.path, 'utf8')
        console.log(stringData)

        // en formato objeto
        const parsedData = JSON.parse(stringData)
        console.log(parsedData)
    }

    getProductsById(id) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)

        let products = parsedData.products
        let product = products.filter(p => p.id === id)

        if (product) {
            console.log(product)
        }
        else {
            console.log(`producto con id ${id} no encontrado`)
        }

    }

}

class CartManager {

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

    searchOrder(id) {
        let stringData = fs.readFileSync(this.path, 'utf8')
        let parsedData = JSON.parse(stringData)

        let idFiltrado = parsedData.order.find(o => o.id === id)
        console.log(idFiltrado)


    }

    deleteOrder() {

    }

}

let ejemplo1 = new CartManager('./carts.json')
ejemplo1.addOrder("titulo")

let ejemplo2 = new CartManager('./carts.json')

ejemplo2.searchOrder(2)