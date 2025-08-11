import fs from "fs";

class CartsManager {

    post(obj) {
        let data = JSON.parse(this.fileContent);
        let newCart = { ...obj, id: data.carts.length + 1 };
        data.carts.push(newCart);

        let jsonObj = {
            carts: data.carts,
        };

        fs.writeFileSync(this.path, JSON.stringify(jsonObj));
        this.fileContent = fs.readFileSync(this.path, { encoding: "utf-8" });
        return jsonObj;
    }

    getById(cid) {
        let data = JSON.parse(this.fileContent);
        console.log(data)
        if (!data || !data.carts || !Array.isArray(data.carts) || !data.carts.length)
            throw new Error("No hay carritos guardados para mostrar.")
        
        const cart = data.carts.filter((c) => c.id == cid)
        if (!cart) throw new Error(`El carrito con ID ${cid} no existe.`)
        return cart;
    }

    putProductInCart(cid, pid, obj) {
        let data = JSON.parse(this.fileContent)
        let cart = data.carts.filter((c) => c.id == cid)
        //data.carts representaría la colección "carts"

        if (!cart) throw new Error(`El carrito con ID ${cid} no existe.`)

        let products = cart.products ?? []
        //carrito vacio? entonces devolver un array vacío
        let { quantity } = obj 

        let product = products.filter(prod => prod.id == pid)

        if (product) {
            product.quantity += quantity ?? 1
        }
        else {
            product = {
                id: pid,
                quantity: quantity ?? 1
            }
            cart.products.push(product)
        }

        let jsonObj = {
            carts: data.carts,
        };

        fs.writeFileSync(this.path, JSON.stringify(jsonObj));
        this.fileContent = fs.readFileSync(this.path, { encoding: "utf-8" });
        return jsonObj;
    }
}

export default CartsManager