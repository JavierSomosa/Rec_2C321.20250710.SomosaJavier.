let carrito = [];

function cargarCarrito() {
  mostrarNombreEnTopbar();
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const tbody = document.getElementById("carrito-body");
  const spanTotal = document.getElementById("carrito-total");

  tbody.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    tbody.innerHTML += `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #eee;">${item.titulo}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">$${item.precio}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${item.cantidad}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">$${subtotal}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">
          <button onclick="eliminar(${index})">Eliminar</button>
        </td>
      </tr>
    `;
  });

  spanTotal.textContent = total;
}

function eliminar(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  cargarCarrito();
}

function irATicket() {
  localStorage.setItem("totalCompra", document.getElementById("carrito-total").textContent);
  window.location.href = "ticket.html";
}

document.addEventListener("DOMContentLoaded", cargarCarrito);
