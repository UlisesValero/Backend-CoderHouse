const socket = io()

// Los productos agregados/eliminados se tienen que actualizar en el momento
// Hacer la lógica para llamar al form renderizado en realTimeProducts

socket.emit('getProducts');

const deleteButton = getElementById('delete-button')
const productsForm = getElementById('products-form')
const nameInput = getElementById('product-name')
const priceInput = getElementById('product-price')
const productsList = getElementById('productslist')

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

  socket.emit('deleteProduct', { name })
  nameInput.value = ''
  priceInput.value = ''

})

socket.on('productsList', (products) => {
  productsList.innerHTML = '';
  products.forEach((product) => {
    const li = document.createElement('li');
    li.textContent = `${product.name}, precio: ${product.price}`;
    productsList.appendChild(li);
  });
});