// Configuración de la API
const API_BASE = "http://localhost:3000/api";

let productoActual = null;
let cantidad = 1;

async function cargarDetalle() {
  mostrarNombreEnTopbar();

  const idSeleccionado = Number(
    localStorage.getItem("productoSeleccionado")
  );

  if (!idSeleccionado) {
    document.body.innerHTML = "<p>No se seleccionó ningún producto.</p>";
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/productos/${idSeleccionado}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        document.body.innerHTML = "<p>Producto no encontrado.</p>";
        return;
      }
      throw new Error("Error al obtener el producto");
    }

    productoActual = await response.json();

    // Usar el campo 'image' de la BD o una imagen por defecto
    const imagenSrc = productoActual.image || "/images/foto-productos/portada-default.jpg";
    
    document.getElementById("detalle-imagen").src = imagenSrc;
    document.getElementById("detalle-imagen").onerror = function() {
      this.src = "/images/foto-productos/portada-default.jpg";
    };
    document.getElementById("detalle-titulo").textContent =
      productoActual.titulo || "Sin título";
    document.getElementById("detalle-descripcion").textContent =
      productoActual.descripcion || "Sin descripción";
    document.getElementById("detalle-precio").textContent =
      productoActual.precio || 0;
  } catch (error) {
    console.error("Error:", error);
    document.body.innerHTML =
      "<p>Error al cargar el producto. Asegurate de que el servidor esté corriendo.</p>";
  }
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

  mostrarNotif("Producto agregado al carrito")

}

function mostrarNotif(msg) {
    const error = document.getElementById("notif-add");
    error.textContent = msg;
}

document.addEventListener("DOMContentLoaded", cargarDetalle);
