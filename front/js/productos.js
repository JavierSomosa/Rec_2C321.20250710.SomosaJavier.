// Configuración de la API
const API_BASE = "http://localhost:3000/api";

let productosActuales = [];
let filtros = {
  tipo: null,
  activo: "true", // Por defecto solo productos activos
};
let paginaActual = 1;
const productosPorPagina = 10;

// Función para obtener productos desde la API
async function obtenerProductos() {
  try {
    const params = new URLSearchParams({
      activo: filtros.activo ? "true" : "false",
      page: paginaActual,
      limit: productosPorPagina,
    });

    if (filtros.tipo) {
      params.append("tipo", filtros.tipo);
    }

    const response = await fetch(`${API_BASE}/productos?${params}`);
    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }

    const resultado = await response.json();
    productosActuales = resultado.data;
    return resultado;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("lista-productos").innerHTML =
      "<p>Error al cargar productos. Asegurate de que el servidor esté corriendo.</p>";
    return null;
  }
}

function renderProductos(lista) {
  const cont = document.getElementById("lista-productos");
  cont.innerHTML = "";

  if (lista.length === 0) {
    cont.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  lista.forEach((p) => {
    // Usar el campo 'image' de la BD o una imagen por defecto
    const imagenSrc = p.image || "/images/foto-productos/portada-default.jpg";
    
    cont.innerHTML += `
      <article class="card-producto" onclick="verDetalle(${p.id})">
        <img src="${imagenSrc}" alt="${p.titulo}" onerror="this.src='/images/foto-productos/portada-default.jpg'">
        <h3>${p.titulo}</h3>
        <p>${p.descripcion || "Sin descripción"}</p>
        <p><strong>Precio: $${p.precio || 0}</strong></p>
      </article>
    `;
  });
}

function renderPaginacion(totalPages) {
  const cont = document.getElementById("paginacion");
  if (!cont) return;

  cont.innerHTML = "";

  if (totalPages <= 1) return;

  if (paginaActual > 1) {
    cont.innerHTML += `<button onclick="cambiarPagina(${paginaActual - 1})">Anterior</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === paginaActual) {
      cont.innerHTML += `<span style="margin: 0 10px; font-weight: bold;">${i}</span>`;
    } else {
      cont.innerHTML += `<button onclick="cambiarPagina(${i})" style="margin: 0 5px;">${i}</button>`;
    }
  }

  if (paginaActual < totalPages) {
    cont.innerHTML += `<button onclick="cambiarPagina(${paginaActual + 1})">Siguiente</button>`;
  }
}

async function cambiarPagina(nuevaPagina) {
  paginaActual = nuevaPagina;
  await cargarProductos();
}

async function filtrar(tipo) {
  filtros.tipo = tipo;
  paginaActual = 1; // Resetear a primera página al filtrar
  await cargarProductos();
}

async function cargarProductos() {
  const resultado = await obtenerProductos();
  if (resultado) {
    renderProductos(productosActuales);
    renderPaginacion(resultado.totalPages);
  }
}

function verDetalle(id) {
  localStorage.setItem("productoSeleccionado", id);
  window.location.href = "detalle.html";
}

// Inicialización cuando carga la página
document.addEventListener("DOMContentLoaded", async () => {
  mostrarNombreEnTopbar();
  await cargarProductos();
});
