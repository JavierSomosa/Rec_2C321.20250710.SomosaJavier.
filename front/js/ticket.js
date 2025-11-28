function cargarTicket() {
  mostrarNombreEnTopbar();

  const usuario = localStorage.getItem("nombreUsuario") || "Invitado";
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = localStorage.getItem("totalCompra") || 0;

  document.getElementById("ticket-usuario").textContent = usuario;

  const fecha = new Date();
  document.getElementById("ticket-fecha").textContent =
    fecha.toLocaleString("es-AR");

  const ul = document.getElementById("ticket-lista");
  ul.innerHTML = "";

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.cantidad} x ${item.titulo} ($${item.precio})`;
    ul.appendChild(li);
  });

  document.getElementById("ticket-total").textContent = total;
}

function nuevaCompra() {
  localStorage.removeItem("carrito");
  localStorage.removeItem("totalCompra");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", cargarTicket);

async function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    unit: "pt",
    format: "a4"
  });

  pdf.setFont("helvetica"); // similar a fuente de la pagina (jspdf no tiene la misma que usamos en el css)
  let y = 40;

  // obtengo datos del ticket
  const usuario = document.getElementById("ticket-usuario").textContent;
  const fecha = document.getElementById("ticket-fecha").textContent;
  const total = document.getElementById("ticket-total").textContent;

  const items = Array.from(document.querySelectorAll("#ticket-lista li"))
    .map(li => li.textContent);

  // cargo logo
  const img = new Image();
  img.src = "/front/images/favicon/rabbit.png";

  img.onload = () => {
    pdf.addImage(img, "PNG", 40, y, 60, 60);

    // titulo
    pdf.setFontSize(28);
    pdf.text("BiblioLiebre", 120, y + 40);

    y += 100;

    // datos
    pdf.setFontSize(14);
    pdf.text(`Cliente: ${usuario}`, 40, y); 
    y += 20;

    pdf.text(`Fecha: ${fecha}`, 40, y);
    y += 30;

    pdf.setFontSize(16);
    pdf.text("Productos:", 40, y);
    y += 20;

    pdf.setFontSize(12);
    items.forEach(item => {
      pdf.text(`• ${item}`, 50, y);
      y += 18;
    });

    y += 20;

    pdf.setFontSize(16);
    pdf.text(`Total: $${total}`, 40, y);

    pdf.save(`Ticket-${usuario}.pdf`);
  };
}
