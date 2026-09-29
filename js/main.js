//ELEMENTOS HTML
const productosContainer = document.getElementById("productosContainer");
const contadorItemsCarrito = document.getElementById("contadorItemCarrito");
const barraBusqueda = document.getElementById("barraBusqueda");
const contadorGuardado = localStorage.getItem("items");
if (contadorGuardado) {
    contadorItemsCarrito.textContent = JSON.parse(contadorGuardado);
}
//CARRITO QUE PROVIENE DEL LOCAL STORAGE
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//FUNCION ASINCRONA QUE UTILIZO PARA OBTENER EL ARRAY DE OBJETOS QUE SE ENCUENTRA EN data.json
async function obtenerProductos() {
    try {
        const datos = await fetch("./data/data.json");
        if (!datos.ok) {
            throw new Error("No se pudieron cargar los productos");
        }
        const productos = await datos.json();
        return productos;
    } catch (error) {
        Swal.fire({
            title: "¡Ocurrió un error!",
            text: "Lo sentimos, no pudimos cargar el catalogo de cafes",
            icon: "error",
            confirmButtonColor: "rgb(121, 38, 23)"
        });

        return [];
    }
}

//FUNCION PARA MOSTRAR LAS TARJETAS CON LOS PRODUCTOS, CON LOS EVENTOS DE SUS RESPECTIVOS BOTONES Y LOS MENSAJES DE BUSQUEDA DE LA BARRA DE BUSQUEDA
function mostrarProductos(productos) {
    productosContainer.innerHTML = ""

    if (productos.length === 0) {
        const mensajeHTML = document.createElement("div");
        mensajeHTML.classList.add("mensajeError");
        mensajeHTML.innerHTML = `
        <h3 class="mensajeError__h3">Lo sentimos, no encontramos ese cafe☕❌ en nuestro catalogo</h3>
        <p class="mensajeError__p">Intenta con otro nombre o país</p>
        `;
        productosContainer.appendChild(mensajeHTML);

        return
    }

    productos.forEach((producto) => {

        const tarjetaHTML = document.createElement("div");
        tarjetaHTML.classList.add("productos__card");
        tarjetaHTML.innerHTML = `
            <div class="productos__card--rotacion">
                <div class="productos__card--front">
                    <h3 class="productos__h3">${producto.nombre}</h3>
                    <img class="productos__img" src="${producto.imagen}" alt="${producto.textoAlt}">
                    <p class="productos__p productos__precio">Precio $${producto.precio} USD</p>
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
        botonAgregarCarrito.addEventListener("click", () => {
            const cafeEnCarrito = carrito.find((cafe) => {
                return cafe.id === producto.id;
            })

            if (!cafeEnCarrito) {
                const { id, nombre, imagen, precio, textoAlt, descripcion } = producto;

                const cafeNuevo = {
                    id,
                    nombre,
                    imagen,
                    precio,
                    textoAlt,
                    descripcion,
                    cantidad: 1
                }
                carrito.push(cafeNuevo);
                contadorItemsCarrito.textContent = Number(contadorItemsCarrito.textContent) + 1;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                localStorage.setItem("items", JSON.stringify(Number(contadorItemsCarrito.textContent)));
                Toastify({ text: "+1 Agregado al Carrito", duration: 1300, offset: { y: "80px" }, style: { background: "rgb(96, 105, 11)", borderRadius: "17px", boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)" } }).showToast();
            } else {
                cafeEnCarrito.cantidad++;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                Toastify({ text: "+1 Agregado al Carrito", duration: 1300, offset: { y: "80px" }, style: { background: "rgb(96, 105, 11)", borderRadius: "17px", boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)" } }).showToast();
            }
        })
    });
}

//FUNCION QUE CREE CON EL FIN DE PODER UTILIZAR MI FUNCION DE mostrarProductos() PARA REUTILIZAR ESA LOGICA PARA GENERAR LAS CARDS FILTRADAS EN LA BARRA DE BUSQUEDA
async function iniciarApp() {
    const productos = await obtenerProductos();
    mostrarProductos(productos);

    barraBusqueda.addEventListener("input", (evento) => {
        const textoEnBusqueda = evento.target.value.toLowerCase().trim().normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const productosFiltrados = productos.filter((producto) => {
            const nombreProducto = producto.nombre.toLowerCase().trim().normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            return nombreProducto.includes(textoEnBusqueda);
        })

        mostrarProductos(productosFiltrados);
    });
}
   


//"ESCUCHADOR" DE LA BARRA DE BUSQUEDA
barraBusqueda.addEventListener("keydown", ((evento) => {
    if (evento.key === "Enter") {
        evento.preventDefault();

        productosContainer.scrollIntoView({ behavior: "smooth" });
    }
}));




iniciarApp();




