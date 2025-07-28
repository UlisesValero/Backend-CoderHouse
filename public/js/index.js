const socket = io()

const products = []

socket.emit('getProducts')

const deleteButton = document.getElementById('delete-button')
const productsForm = document.getElementById('products-form')
const nameInput = document.getElementById('product-name')
const priceInput = document.getElementById('product-price')
const productsList = document.getElementById('productsList')

productsForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const newProduct = {
    name: nameInput.value,
    price: priceInput.value
  }

  socket.emit('addProduct', newProduct)
  nameInput.value = ''
  priceInput.value = ''
})

deleteButton.addEventListener('click', () => {
  const name = nameInput.value

  if (!name) {
    alert("Para eliminar un producto, tenes que ingresar su nombre.")
    return
  }

  socket.emit('deleteProduct', { name })
  nameInput.value = ''
  priceInput.value = ''
})

socket.on('productsList', (products) => {
  productsList.innerHTML = ''
  products.forEach((product) => {
    const li = document.createElement('li')
    li.textContent = `${product.name}, precio: ${product.price}`
    productsList.appendChild(li)
  })
})
