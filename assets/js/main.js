//* importar JSON
import myJson from '../json/product.json' assert {type: 'json'};

//* Dibujar productos en la web
const productsList = document.querySelector("#products-container");
//* Mostrar y ocultar carrito
const navToggle = document.querySelector(".nav__button--toggle");
const navCar = document.querySelector(".nav__car");
//* Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
//* Vaciar carrito
const emptyCarButton = document.querySelector("#empty-car");
//* Car counter
const carCounter = document.querySelector("#car-counter");
//* Array Carrito
//? Necesitamos tener un array que reciba los elementos que debo introducir en el carrito de compras.
let carProducts = [];
//* Ventana Modal
const modalContainer = document.querySelector("#modal-container");
const modalElement = document.querySelector("#modal-element");
let modalDetails = [];
//* Suma total de valores
const totalValue = document.querySelector("#total-value");

navToggle.addEventListener("click", () => {
  navCar.classList.toggle("nav__car--visible");
});

eventListenersLoader();

function eventListenersLoader() {
  //* Cuando se presione el botón "Add to car"
  productsList.addEventListener("click", addProduct);
  //* Cuando se presione el botón "Delete"
  car.addEventListener("click", deleteProduct);
  //* Cuando se de click al botón Empty Car
  emptyCarButton.addEventListener("click", emptyCar);

  //* Listeners Modal.
  //* Cuando se de click al botón de ver detalles
  productsList.addEventListener("click", modalProduct);
  //* Cuando se de click al botón de cerrar modal.
  modalContainer.addEventListener("click", closeModal);

  //* Se ejecuta cuando carga la página
  document.addEventListener("DOMContentLoaded", () => {
    //* Si el LocalStorage tiene info, entonces, igualamos carProducts con la info del LocalStorage. Pero, si el LocalStorage está vacío, entonces, carProducts es igual a un array vacío.

    carProducts = JSON.parse(localStorage.getItem("car")) || [];
    carElementsHTML();
  });
}

//* Hacer petición a la API de productos
//* 1. Crear una función con la petición:

function getProducts() {
      printProducts(myJson?.products);
}
getProducts();

//* 2. Renderizar los productos capturados de la API en mi HTML.

function printProducts(products) {
  let html = "";
  for (let product of products) {
    
    html += `
            <div class="products__element">
                <img src="${
                  product?.image
                }" alt="product_img" class="products__img">
                <p class="products__name">${product?.name}</p>
                <div class="products__div">
                    <p class="products__usd">COP: </p>
                    <p class="products__price">${product?.price.toFixed(3)}</p>
                </div>
                
                    <button data-id=${
                      product?.id} class="products__button add_car">
                        <ion-icon name="add-outline" class="add_car"></ion-icon>
                    </button>
                    <button data-id=${product?.id} data-description="${
                              product?.description
                            }" class="products__button products__button--search products__details" data-quantity="${
                              product?.quantity
                            }">
                        <ion-icon name="search-outline" class="products__details"></ion-icon>
                    </button>
            </div>
        `;
  }
  productsList.innerHTML = html;
  
}

//* Agregar los productos al carrito
//* 1. Capturar la información del producto al que se dé click.
function addProduct(event) {
  //* Método contains => valída si existe un elemento dentro de la clase.
  const cartButton = event.target.closest(".add_car");
  if (cartButton) {
    const product = cartButton.closest(".products__element");
    //* parentElement => nos ayuda a acceder al padre inmediatamente superior del elemento. ANTERIOR
    // El método closest busca el ancestro más cercano que coincide con el selector proporcionado.
    carProductsElements(product);
  }
}


//* 2. Debemos transformar la información HTML a un array de objetos.
//* 2.1 Debo validar si el elemento seleccionado ya se encuentra dentro del array del carrito (carProducts). Si existe, le debo sumar una unidad para que no se repita.
function carProductsElements(product) {
  const infoProduct = {
    id: Number(product.querySelector("button").getAttribute("data-id")),
    image: product?.querySelector("img")?.src,
    name: product?.querySelector("p")?.textContent,
    price: product?.querySelector(".products__div .products__price")?.textContent,
    quantity: 1,
    // textContent nos permite pedir el texto que contiene un elemento.
  };
  

  //* Agregar el objeto de infoProduct al array de carProducts, pero hay que validar si el elemento existe o no.
  //? El primer if valída si por lo menos un elemento que se encuentre en carProducts es igual al que quiero enviarle en infoProduct.
  if (carProducts.some((product) => product.id === infoProduct.id)) {
    //True or False

    const productIncrement = carProducts.map((product) => {
      if (product.id === infoProduct.id) {
        product.quantity++;
        return product;
      } else {
        return product;
      }
    });
    carProducts = [...productIncrement];
  } else {
    carProducts = [...carProducts, infoProduct];
  }

  carElementsHTML();
}

function carElementsHTML() {
  let total = 0;
  let carHTML = "";
  for (let product of carProducts) {
    total += Number(product.price) * product.quantity;
    carHTML += `
        <div class="car__product">
            <div class="car__product__image">
              <img src="${product?.image}">
            </div>
            <div class="car__product__description">
              <p>${product?.name}</p>
              <p>Precio: ${product?.price}</p>
              <p>Cantidad: ${product?.quantity}</p>
            </div>
            <div class="car__product__button">
                <button class="delete__product" data-id="${product?.id}">
                    Delete
                </button>
            </div>
        </div>
        <hr>
        `;
  }
  carList.innerHTML = carHTML;
  //* Crear suma total del pedido.
  if (carProducts.length > 0) {
    totalValue.innerHTML = `<h3>Suma Total: COP ${total.toFixed(3)}</h3>`;
  } else {
    totalValue.innerHTML = "";
  }

  let value = 0;
  for (let counter of carProducts) {
    value += counter.quantity;
  }
  carCounter.innerHTML = `<p>${value}</p>`;

  productsStorage();
}

//*LocalStorage
function productsStorage() {
  localStorage.setItem("car", JSON.stringify(carProducts));
}

//* Eliminar productos del carrito
function deleteProduct(event) {
  if (event.target.classList.contains("delete__product")) {
    const productId = event.target.getAttribute("data-id");
    carProducts = carProducts.filter((product) => product.id != productId);
    carElementsHTML();
  }
}

//* Vaciar el carrito
function emptyCar() {
  carProducts = [];
  carElementsHTML();
}

//* Ventana Modal
//* 1. Crear función que escuche el botón del producto.
/*function modalProduct(event) {
  if (event.target.classList.contains("products__details")) {
    modalContainer.classList.add("show__modal");
    const product = event.target.parentElement.parentElement;
    console.log(product)
    modalDetailsElement(product);
  }
}
*/
function modalProduct(event) {
  const detailsButton = event.target.closest(".products__details");
  if (detailsButton) {
    modalContainer.classList.add("show__modal");
    const product = detailsButton.closest(".products__element");
    modalDetailsElement(product);
  }
}

//* 2. Crear función que escuche el botón de cierre.
function closeModal(event) {
  if (event.target.classList.contains("modal__icon")) {
    modalContainer.classList.remove("show__modal");
  }
}

//* 3. Crear función que convierta la info HTML en objeto.
function modalDetailsElement(product) {
  const infoDatails = {
    id: product.querySelector("button").getAttribute("data-id"),
    image: product.querySelector("img").src,
    name: product.querySelector("p").textContent,
    price: product.querySelector(".products__div .products__price").textContent,
    description: product
      .querySelector(".products__details")
      .getAttribute("data-description"),
    stock: product
      .querySelector(".products__details")
      .getAttribute("data-quantity"),
  };
  modalDetails = [...modalDetails, infoDatails];
  modalHTML();
}

//* 4. Dibujar producto dentro del modal.
function modalHTML() {
  let detailsHTML = "";
  for (let element of modalDetails) {
    detailsHTML = `
            <div class="modal__info">
                <div class="modal__info--first">
                    <h3>${element?.name}</h3>
                    <h2>$${element?.price}</h2>
                    <h4>Stock disponible: ${element?.stock}</h4>
                    <h4>Descripción:</h4>
                    <p>${element?.description}</p>
                </div>
                <div class="modal__info--second">
                    <img src="${element?.image}">
                    <div></div>
                </div>
            </div>
        `;
  }
  modalElement.innerHTML = detailsHTML;
}
