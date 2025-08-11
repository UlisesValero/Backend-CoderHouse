import fs from "fs";
import productModel from "../models/Products";

class ProductsManager {

    get() {
        let data = JSON.parse(this.fileContent);
        if (!data || !data.products || !Array.isArray(data.products) || !data.products.length)
            throw new Error("No hay productos para mostrar.");
        return data;
    }

    getById(pid) {
        let data = this.get();
        const product = data.products.filter((prod) => prod.id == pid);
        if (!product) throw new Error(`El producto con ID ${pid} no existe.`);
        return product;
    }

    post(obj) {
        let data = this.get();

        let existsTitle = data.products.some((prod) => prod.title == obj.title);
        if (existsTitle) throw new Error(`Producto ${obj.title} ya existe.`);

        let existsCode = data.products.some((prod) => prod.code == obj.code);
        if (existsCode)
            throw new Error(`Producto con código ${obj.code} ya existe.`);

        let newProduct = { ...obj, id: data.products.length + 1 };
        data.push(newProduct);

        let jsonObj = {
            products: data,
        };

        fs.writeFileSync(this.path, JSON.stringify(jsonObj));
        this.fileContent = fs.readFileSync(this.path, { encoding: "utf-8" });
        return jsonObj;
    }

    put(pid, fields) {
        let data = this.get();
        let productIdx = data.products.find((prod) => prod.id == pid);

        if (!productIdx) throw new Error(`El producto con ID ${pid} no existe.`);

        let product = data.products[productIdx];
        let updatedProduct = { ...product, ...fields };
        data[productIdx] = updatedProduct;

        let jsonObj = {
            products: data.products,
        };

        fs.writeFileSync(this.path, JSON.stringify(jsonObj));
        this.fileContent = fs.readFileSync(this.path, { encoding: "utf-8" });
        return updatedProduct;
    }

    delete(pid) {
        let data = this.get();
        let updatedData = data.products.filter((prod) => prod.id != pid);

        if (data.length == updatedData.length)
            throw new Error(`El producto con ID ${pid} no existe.`);

        let jsonObj = {
            products: updatedData,
        };

        fs.writeFileSync(this.path, JSON.stringify(jsonObj));
        this.fileContent = fs.readFileSync(this.path, { encoding: "utf-8" });
        return jsonObj;
    }
}

export default ProductsManager