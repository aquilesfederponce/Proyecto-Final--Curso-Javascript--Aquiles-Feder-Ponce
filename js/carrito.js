const carritoContainer = document.getElementById("carritoContainer");
const subtotalContainer = document.getElementById("subtotal");
const indicadorTotal = document.getElementById("total");
const botonPagar = document.getElementById("botonPagar");
const botonVaciarCarrito = document.getElementById("botonVaciar");
const abrirCarrito = document.getElementById("abrirCarrito");
const pagarContainer = document.getElementById("pagarContainer");

const contadorItemsCarrito = document.getElementById("contadorItemCarrito");
const contadorGuardado = localStorage.getItem("items");
if (contadorGuardado) {
    contadorItemsCarrito.textContent = JSON.parse(contadorGuardado);
}

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function mostrarCarrito() {
    carritoContainer.innerHTML = "";

    carrito.forEach((item) => {
        const tarjetaHTML = document.createElement("div");
        tarjetaHTML.classList.add("productos__card");
        tarjetaHTML.innerHTML = `
            <div class="productos__card--rotacion">
                <div class="productos__card--front">
                    <h3 class="productos__h3">${item.nombre}</h3>
                    <img class="productos__img" src="../${item.imagen}" alt="${item.textoAlt}">
                    <p class="productos__p productos__precio">Precio $${item.precio} USD</p>
                    <p class="productos__p">Cantidad: ${item.cantidad}</p>
                    <div class="carrito__modificar">
                        <button class="carrito__modificar--sumar">+</button>
                        <span class="carrito__modificar--span">Modifica la cantidad</span>
                        <button class="carrito__modificar--restar">-</button>
                    </div>
                    <button class= "carrito__boton--eliminar">Eliminar del carrito</button>
                </div>
                <div class="productos__card--back">
                    <h3 class="productos__h3">${item.nombre}</h3>
                    <p class="productos__descripcion">${item.descripcion}</p>
                    <button class= "productos__boton--info">Volver atras</button>
                </div>
            </div>
            `;

        carritoContainer.appendChild(tarjetaHTML);

        const cardRotacion = tarjetaHTML.querySelector(".productos__card--rotacion");
        const botonesInfo = tarjetaHTML.querySelectorAll(".productos__boton--info");
        botonesInfo.forEach((boton) => {
            boton.addEventListener("click", () => {
                cardRotacion.classList.toggle("girar");
            })
        })

        const botonSumar = tarjetaHTML.querySelector(".carrito__modificar--sumar");
        botonSumar.addEventListener("click", () => {
            item.cantidad++;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
            resumenDeCompra();
        });

        const botonRestar = tarjetaHTML.querySelector(".carrito__modificar--restar");
        botonRestar.addEventListener("click", () => {
            item.cantidad > 1 ? item.cantidad-- : item.cantidad = 1;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
            resumenDeCompra();
        });



        const botonEliminar = tarjetaHTML.querySelector(".carrito__boton--eliminar");
        botonEliminar.addEventListener("click", () => {
            const indiceCarrito = carrito.findIndex((itemCart) => {
                return itemCart.id === item.id
            });
            carrito.splice(indiceCarrito, 1);
            contadorItemsCarrito.textContent = Number(contadorItemsCarrito.textContent) - 1;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            localStorage.setItem("items", JSON.stringify(Number(contadorItemsCarrito.textContent)));
            Toastify({ text: "Eliminado del carrito❌", duration: 1300, offset: { y: "80px" }, style: { background: "rgb(121, 38, 23)", borderRadius: "17px", boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)"} }).showToast();
            mostrarCarrito();
            resumenDeCompra();
        })
    });
}

function resumenDeCompra() {
    subtotalContainer.innerHTML = "";

    carrito.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        const itemLista = document.createElement("li");
        itemLista.classList.add("pagar__li");
        itemLista.innerHTML = `
        ${item.nombre} - ${item.cantidad}u - $${subtotal} USD
        `
        subtotalContainer.appendChild(itemLista);
    })
    const total = carrito.reduce((acumulador, operacion) => {
        return acumulador + (operacion.precio * operacion.cantidad)
    }, 0);
    indicadorTotal.textContent = "TOTAL $" + total + " USD";
}

botonVaciarCarrito.addEventListener("click", async () => {
    if (carrito.length > 0) {
        const result = await Swal.fire({
            title: "¿Estas seguro que quieres vaciar el carrito?",
            text: "¡Se perderan todos tus productos!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "rgb(96, 105, 11)",
            cancelButtonColor: "rgb(121, 38, 23)",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Vaciar carrito"
        })
        if (result.isConfirmed) {
            carrito.length = 0;
            contadorItemsCarrito.textContent = 0;

            localStorage.setItem("carrito", JSON.stringify(carrito));
            localStorage.setItem("items", JSON.stringify(Number(contadorItemsCarrito.textContent)));
            mostrarCarrito();
            resumenDeCompra();

            Swal.fire({
                title: "¡Carrito vaciado!",
                text: "El carrito fue vaciado correctamente",
                icon: "error"
            });
        };

    }
});

abrirCarrito.addEventListener("click", () => {
    pagarContainer.classList.toggle("mostrar");
});


mostrarCarrito();
resumenDeCompra();