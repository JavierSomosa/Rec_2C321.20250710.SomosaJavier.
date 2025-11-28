const productosMock = [
  {
    id: 1,
    titulo: "El principito",
    tipo: "libro",
    descripcion: "Un clásico sobre un niño y un zorro.",
    imagen: "https://via.placeholder.com/400x260.png?text=Libro",
    precio: 3500,
  },
  {
    id: 2,
    titulo: "Matrix",
    tipo: "pelicula",
    descripcion: "¿Y si todo fuera una simulación?",
    imagen: "https://via.placeholder.com/400x260.png?text=Película",
    precio: 4200,
  },
  {
    id: 3,
    titulo: "1984",
    tipo: "libro",
    descripcion: "Vigilancia y control total.",
    imagen: "https://via.placeholder.com/400x260.png?text=Libro",
    precio: 3100,
  },
];

let productoActual = null;
let cantidad = 1;

function cargarDetalle() {
  mostrarNombreEnTopbar();

  const idSeleccionado = Number(
    localStorage.getItem("productoSeleccionado")
  );

  productoActual = productosMock.find((p) => p.id === idSeleccionado);

  if (!productoActual) {
    document.body.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  document.getElementById("detalle-imagen").src = productoActual.imagen;
  document.getElementById("detalle-titulo").textContent =
    productoActual.titulo;
  document.getElementById("detalle-descripcion").textContent =
    productoActual.descripcion;
  document.getElementById("detalle-precio").textContent =
    productoActual.precio;
}

function cambiarCantidad(delta) {
  cantidad += delta;
  if (cantidad < 1) cantidad = 1;
  document.getElementById("detalle-cant").textContent = cantidad;
}

function comprar() {
  if (!productoActual) return;

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const existente = carrito.find((item) => item.id === productoActual.id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: productoActual.id,
      titulo: productoActual.titulo,
      precio: productoActual.precio,
      cantidad: cantidad,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  alert("Producto agregado al carrito");
  window.location.href = "carrito.html";
}

document.addEventListener("DOMContentLoaded", cargarDetalle);
