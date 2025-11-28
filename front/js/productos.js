// Datos de prueba
const productosMock = [
  {
    id: 1,
    titulo: "El principito",
    tipo: "libro",
    descripcion: "Un clásico sobre un niño y un zorro.",
    imagen:
      "https://via.placeholder.com/200x260.png?text=Libro",
    precio: 3500,
  },
  {
    id: 2,
    titulo: "Matrix",
    tipo: "pelicula",
    descripcion: "¿Y si todo fuera una simulación?",
    imagen:
      "https://via.placeholder.com/200x260.png?text=Película",
    precio: 4200,
  },
  {
    id: 3,
    titulo: "1984",
    tipo: "libro",
    descripcion: "Vigilancia y control total.",
    imagen:
      "https://via.placeholder.com/200x260.png?text=Libro",
    precio: 3100,
  },
];

let filtros = {
  tipo: null,
};

function renderProductos(lista) {
  const cont = document.getElementById("lista-productos");
  cont.innerHTML = "";

  lista.forEach((p) => {
    cont.innerHTML += `
      <article class="card-producto" onclick="verDetalle(${p.id})">
        <img src="${p.imagen}" alt="${p.titulo}">
        <h3>${p.titulo}</h3>
        <p>${p.descripcion}</p>
      </article>
    `;
  });
}

function filtrar(tipo) {
  filtros.tipo = tipo;
  const filtrados = productosMock.filter((p) => p.tipo === tipo);
  renderProductos(filtrados);
}

function verDetalle(id) {
  // Guardamos el ID y vamos a la pantalla de detalle
  localStorage.setItem("productoSeleccionado", id);
  window.location.href = "detalle.html";
}

// Inicialización cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  mostrarNombreEnTopbar();
  renderProductos(productosMock);
});
