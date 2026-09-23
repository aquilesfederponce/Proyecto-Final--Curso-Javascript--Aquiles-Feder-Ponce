const productosContainer = document.getElementById("productosContainer");
const contadorItemsCarrito = document.getElementById("contadorItemCarrito");
const barraBusqueda = document.getElementById("barraBusqueda");

async function obtenerProductos() {
    try {
        const datos = await fetch("./data/data.json");
        if (!datos.ok) {
            alert("ocurrio un error")
        }
        const productos = await datos.json();
        return productos;
    } catch {
        alert("Ocurrio un error al cargar los datos");
    }
}

async function mostrarProductos() {
    try {
        const productos = await obtenerProductos();

        productosContainer.innerHTML = ""
        productos.forEach((producto) => {

            const tarjetaHTML = document.createElement("div");
            tarjetaHTML.classList.add("productos__card");
            tarjetaHTML.innerHTML = `
            <div class="productos__card--rotacion">
                <div class="productos__card--front">
                    <h3 class="productos__h3">${producto.nombre}</h3>
                    <img class="productos__img" src="${producto.imagen}" alt="${producto.textoAlt}">
                    <p class="productos__p productos__precio">Precio $${producto.precio}</p>
                    <p class="productos__p">Stock ${producto.stock}</p>
                    <button class= "productos__boton--info">Ver mas info</button>
                    <button class= "productos__boton--agregar">Agregar al carrito</button>
                </div>
                <div class="productos__card--back">
                    <h3 class="productos__h3">${producto.nombre}</h3>
                    <p class="productos__descripcion">${producto.descripcion}</p>
                    <button class= "productos__boton--info">Volver atras</button>
                </div>
            </div>
            `;

            productosContainer.appendChild(tarjetaHTML);

            const cardRotacion = tarjetaHTML.querySelector(".productos__card--rotacion");
            const botonesInfo = tarjetaHTML.querySelectorAll(".productos__boton--info");
            botonesInfo.forEach((boton) => {
                boton.addEventListener("click", () => {
                    cardRotacion.classList.toggle("girar");
                })
            })

            const botonAgregarCarrito = tarjetaHTML.querySelector(".productos__boton--agregar");
            botonAgregarCarrito.addEventListener("click", async () => {

            })
        });
    }
    catch {

    }
}

mostrarProductos();