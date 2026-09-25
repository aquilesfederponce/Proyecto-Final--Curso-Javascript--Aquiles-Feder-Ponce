//ELEMENTOS HTML
const carritoContainer = document.getElementById("carritoContainer");
const subtotalContainer = document.getElementById("subtotal");
const indicadorTotal = document.getElementById("total");
const botonPagar = document.getElementById("botonPagar");
const botonVaciarCarrito = document.getElementById("botonVaciar");
const abrirCarrito = document.getElementById("abrirCarrito");
const pagarContainer = document.getElementById("pagarContainer");
const barraBusqueda = document.getElementById("barraBusqueda");

const contadorItemsCarrito = document.getElementById("contadorItemCarrito");
const contadorGuardado = localStorage.getItem("items");
if (contadorGuardado) {
    contadorItemsCarrito.textContent = JSON.parse(contadorGuardado);
}

//CARRITO QUE PROVIENE DEL LOCAL STORAGE
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//FUNCION LA CUAL CUMPLE LA FUNCION DE MOSTRAR DINAMICAMENTE EL CARRITO DEPENDIENDO LOS VALORES DEL ARRAY DEL LOCAL STORAGE. TIENE SUS BOTONES CON SUS EVENTOS Y LA MISMA LOGICA DE LA BARRA DE BUSQUEDA QUE EN main.js
function mostrarCarrito(carritoMostrado = carrito) {
    carritoContainer.innerHTML = "";

    if (carritoMostrado.length === 0) {
        const mensajeHTML = document.createElement("div");
        mensajeHTML.classList.add("mensajeError");
        mensajeHTML.innerHTML = `
        <h3 class="mensajeError__h3">Lo sentimos, no encontramos ningun cafe☕❌ en el carrito.</h3>
        <p class="mensajeError__p">Intenta agregarlo al carrito o buscar otro nombre</p>
        `;
        carritoContainer.appendChild(mensajeHTML);

        return
    }

    carritoMostrado.forEach((item) => {
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
            Toastify({ text: "Eliminado del carrito❌", duration: 1300, offset: { y: "80px" }, style: { background: "rgb(121, 38, 23)", borderRadius: "17px", boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)" } }).showToast();
            mostrarCarrito();
            resumenDeCompra();
        })
    });
}

//FUNCION PARA CALCULAR EL TOTAL A PAGAR DEL CARRITO
function calcularTotal() {
    const total = carrito.reduce((acumulador, operacion) => {
        return acumulador + (operacion.precio * operacion.cantidad)
    }, 0);

    return total;
}

//FUNCION QUE RECOPILA LA INFORMACION DEL CARRITO PARA LUEGO SER MOSTRADA EN UNA PEQUEÑA CARD
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
    const total = calcularTotal();
    indicadorTotal.textContent = "TOTAL $" + total + " USD";
}

//"ESCUCHADORES" DEL RESUMEN DE LA COMPRA
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

botonPagar.addEventListener("click", async () => {
    if (carrito.length > 0) {
        const total = calcularTotal();
        const result = await Swal.fire({
            title: "¿Deseas efectuar tu compra?",
            text: "El monto a pagar será $" + total + " USD",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "rgb(96, 105, 11)",
            cancelButtonColor: "rgb(121, 38, 23)",
            cancelButtonText: "Cancelar",
            confirmButtonText: "¡Comprar!"
        })
        if (result.isConfirmed) {
            carrito.length = 0;
            contadorItemsCarrito.textContent = 0;

            localStorage.setItem("carrito", JSON.stringify(carrito));
            localStorage.setItem("items", JSON.stringify(Number(contadorItemsCarrito.textContent)));
            mostrarCarrito();
            resumenDeCompra();

            Swal.fire({
                title: "¡Muchas gracias por tu compra!",
                text: "Te enviaremos por email tu comprobante de pago",
                icon: "success"
            });
        };

    }
});


//EVENTOS
abrirCarrito.addEventListener("click", () => {
    pagarContainer.classList.toggle("mostrar");
});

barraBusqueda.addEventListener("keydown", ((evento) => {
    if (evento.key === "Enter") {
        evento.preventDefault();

        carritoContainer.scrollIntoView({ behavior: "smooth" });
    }
})
);

barraBusqueda.addEventListener("input", (evento) => {
    const textoEnBusqueda = evento.target.value.toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const carritoFiltrado = carrito.filter((producto) => {
        const nombreProducto = producto.nombre.toLowerCase().normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        return nombreProducto.includes(textoEnBusqueda);
    })

    mostrarCarrito(carritoFiltrado);
})



mostrarCarrito();
resumenDeCompra();