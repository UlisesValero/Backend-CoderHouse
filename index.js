import express from 'express'
import handlebars from 'express-handlebars'
import productsRouter from './src/routes/products.router.js'
import cartsRouter from './src/routes/carts.router.js'

process.loadEnvFile()

const app = express()
const PORT = 8080
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('./public'))

app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

const enviroment = async () => {
    await mongoose.connect(process.env.MONGO_STRING)
}
enviroment()

const sampleProducts = [
    {
        title: "Laptop Gaming Pro",
        description: "Laptop de alto rendimiento para gaming y trabajo profesional",
        price: 1299.99,
        code: "LAP001",
        stock: 15,
        category: "Electrónicos"
    },
    {
        title: "Smartphone Galaxy S24",
        description: "Smartphone de última generación con cámara avanzada",
        price: 899.99,
        code: "PHN001",
        stock: 25,
        category: "Electrónicos"
    },
    {
        title: "Auriculares Bluetooth Premium",
        description: "Auriculares inalámbricos con cancelación de ruido",
        price: 199.99,
        code: "AUD001",
        stock: 30,
        category: "Accesorios"
    },
    {
        title: "Tablet iPad Pro",
        description: "Tablet profesional para creativos y desarrolladores",
        price: 1099.99,
        code: "TAB001",
        stock: 12,
        category: "Electrónicos"
    },
    {
        title: "Teclado Mecánico RGB",
        description: "Teclado gaming con switches mecánicos y iluminación RGB",
        price: 149.99,
        code: "KEY001",
        stock: 20,
        category: "Accesorios"
    },
    {
        title: "Monitor 4K 27\"",
        description: "Monitor profesional con resolución 4K y colores precisos",
        price: 599.99,
        code: "MON001",
        stock: 8,
        category: "Electrónicos"
    },
    {
        title: "Mouse Gaming Wireless",
        description: "Mouse gaming inalámbrico con sensor de alta precisión",
        price: 79.99,
        code: "MOU001",
        stock: 35,
        category: "Accesorios"
    },
    {
        title: "Webcam HD 1080p",
        description: "Webcam de alta definición para streaming y videoconferencias",
        price: 89.99,
        code: "CAM001",
        stock: 18,
        category: "Accesorios"
    },
    {
        title: "SSD NVMe 1TB",
        description: "Disco sólido de alta velocidad para gaming y trabajo",
        price: 129.99,
        code: "SSD001",
        stock: 22,
        category: "Componentes"
    },
    {
        title: "Memoria RAM 32GB DDR5",
        description: "Kit de memoria RAM de alta velocidad para gaming",
        price: 199.99,
        code: "RAM001",
        stock: 14,
        category: "Componentes"
    },
    {
        title: "Tarjeta Gráfica RTX 4070",
        description: "Tarjeta gráfica de última generación para gaming 4K",
        price: 699.99,
        code: "GPU001",
        stock: 6,
        category: "Componentes"
    },
    {
        title: "Fuente de Poder 750W",
        description: "Fuente de poder modular para sistemas gaming",
        price: 119.99,
        code: "PSU001",
        stock: 16,
        category: "Componentes"
    }
];

const sampleCarts = [
    {
        products: []
    },
    {
        products: []
    }
];

async function seedDatabase() {
    try {
        // Insert sample products
        const createdProducts = await ProductModel.insertMany(sampleProducts);
        console.log(`Inserted ${createdProducts.length} products`);

        // Create sample carts with some products
        const cart1 = await CartModel.create({
            products: [
                { product: createdProducts[0], quantity: 2 },
                { product: createdProducts[1], quantity: 1 }
            ]
        });

        const cart2 = await CartModel.create({
            products: [
                { product: createdProducts[2]._id, quantity: 3 },
                { product: createdProducts[3]._id, quantity: 1 }
            ]
        });

        console.log(`Created ${sampleCarts.length} sample carts`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})



let products = []

sockets.on('connection', (socket) => {
    console.log(`Nuevo usuario conectado`)

    socket.on('getProducts', (...products) => {
        sockets.emit('getProducts', ...products)
    })

    socket.on('addProduct', (product) => {
        product.id = products.length + 1

        products.push(product)
        sockets.emit('productsList', products)

    })

    socket.on('deleteProduct', ( {name} ) => {
    
        products = products.filter(p => p.name !== name)
        sockets.emit('productsList', products)
        
    })

    socket.on('disconnected', () => {
        console.log(`Usuario desconectado`)
    })
})