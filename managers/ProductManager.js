const fs = require('fs')

class ProductManager {

    constructor(route) {
        this.path = route

        try {
            fs.readFileSync(this.path, 'utf8')
        }
        catch {
            let initial = {
                products: []
            }

            fs.writeFileSync(this.path, JSON.stringify(initial))
        }
    }


    addProduct(product) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)
        const products = parsedData.products

        let existingTitle = products.find(p => p.title === product.title)
        if (existingTitle) throw new Error(`El producto con titulo ${product.title} ya existe`)

        let existingCode = products.find(p => p.code === product.code)
        if (existingCode) throw new Error(`El producto con el código ${product.code} ya existe`)

        let newProduct = {
            id: products.length + 1,
            ...product
        }

        const index = products.find(p => p.id === newProduct.id)
        if (index) throw new Error(`Producto con id ${newProduct.id} ya existe`)

        products.push(newProduct)

        let json = {
            products: products,
        }

        fs.writeFileSync(this.path, JSON.stringify(json))
        return json
    }

    getProducts() {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)
        return parsedData
    }

    getProductsById(id) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)

        if (!parsedData.products) parsedData.products = []
        let products = parsedData.products

        let product = products.find(p => p.id === id)

        if (product) {
            return product
        } else {
            return null
        }
    }

    putProduct(pid, newData) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)
        const products = parsedData.products

        let product = products.find(p => p.id === pid)
        let idx = products.indexOf(product)
        if (!product) throw new Error(`Producto con id ${pid} no existe`)

        products[idx] = {
            ...product,
            ...newData,
            id: pid
        }
        console.log(product, products)

        const updatedData = { products }

        fs.writeFileSync(this.path, JSON.stringify(updatedData, null, 2))
        return product
    }

    deleteProduct(pid) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)
        const products = parsedData.products

        const filteredProduct = products.filter(p => p.id !== pid)

        if (products.length == filteredProduct.length)
            throw new Error(`El producto con el id ${pid} no existe`)

        let json = {
            products: filteredProduct
        }

        fs.writeFileSync(this.path, JSON.stringify(json))
        return json
    }
}

module.exports = ProductManager

let ejemplo = new ProductManager("./src/products.json")
ejemplo.getProductsById(2)
