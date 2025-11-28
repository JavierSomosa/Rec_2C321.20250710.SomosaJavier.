function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarProductos(lista) {
    localStorage.setItem("productos", JSON.stringify(lista));
}

function refrescarTabla() {
    const productos = obtenerProductos();
    const tbody = document.getElementById("admin-tbody");
    tbody.innerHTML = "";

    productos.forEach((p) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${p.id}</td>
        <td>${p.titulo}</td>
        <td>${p.tipo}</td>
        <td>$${p.precio}</td>
        <td>${p.fecha}</td>
        <td>${p.estado}</td>
    `;

    tbody.appendChild(fila);
    });
}

function generarNuevoID() {
    const productos = obtenerProductos();
    if (productos.length === 0) return 1;

    // Busca el ID mayor
    const maxId = Math.max(...productos.map(p => p.id));
    return maxId + 1;
}



function alta() {
    const titulo = prompt("Título del producto:");
    if (!titulo) return;

    const tipo = prompt("Tipo (Libro / Película):");
    if (!tipo) return;

    const precio = prompt("Precio:");
    if (!precio || isNaN(precio)) return alert("Precio inválido");

    const fecha = prompt("Fecha de salida (YYYY-MM-DD):");
    if (!fecha) return;

    const estado = prompt("Estado (Activo / Inactivo):") || "Activo";

    const productos = obtenerProductos();

    const nuevo = {
    id: generarNuevoID(), // genera un ID unico
    titulo,
    tipo,
    precio: Number(precio),
    fecha,
    estado,
    };

    productos.push(nuevo);
    guardarProductos(productos);
    refrescarTabla();
}


function baja() {
    const id = Number(prompt("ID a eliminar:"));
    if (!id) return;

    const productos = obtenerProductos();
    const filtrados = productos.filter((p) => p.id !== id);

    if (filtrados.length === productos.length) {
    alert("No se encontró ningún producto con ese ID");
    return;
    }

    guardarProductos(filtrados);
    refrescarTabla();
}


function modificar() {
    const id = Number(prompt("ID a modificar:"));
    if (!id) return;

    const productos = obtenerProductos();
    const producto = productos.find((p) => p.id === id);

    if (!producto) {
    alert("No existe un producto con ese ID.");
    return;
    }

    const nuevoTitulo = prompt("Nuevo título:", producto.titulo);
    const nuevoTipo = prompt("Nuevo tipo:", producto.tipo);
    const nuevoPrecio = prompt("Nuevo precio:", producto.precio);
    const nuevaFecha = prompt("Nueva fecha (YYYY-MM-DD):", producto.fecha);
    const nuevoEstado = prompt("Nuevo estado:", producto.estado);

  // actualiza
    producto.titulo = nuevoTitulo || producto.titulo;
    producto.tipo = nuevoTipo || producto.tipo;
    producto.precio = Number(nuevoPrecio) || producto.precio;
    producto.fecha = nuevaFecha || producto.fecha;
    producto.estado = nuevoEstado || producto.estado;

    guardarProductos(productos);
    refrescarTabla();
}


document.addEventListener("DOMContentLoaded", refrescarTabla);
