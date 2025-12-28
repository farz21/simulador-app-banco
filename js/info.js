// ============================
// INFO DE USUARIO
// ============================

const userTableBody = document.getElementById("userTableBody");
const volverBtn = document.getElementById("volverBtn");

// Traer usuario actual
let usuarioActual = localStorage.getItem("usuarioActual");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuario = usuarios.find(u => u.email === usuarioActual);

// Si no hay sesión, volver al index
if(!usuario){
  window.location.href = "../index.html";
} else {
  // Calcular edad si hay fecha de nacimiento
  let edad = "-";
  if(usuario.nacimiento){
    const hoy = new Date();
    const nacimiento = new Date(usuario.nacimiento);
    edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
  }

  // Insertar datos en la tabla
  userTableBody.innerHTML = `
    <tr>
      <td data-label="Nombre">${usuario.nombre}</td>
      <td data-label="Apellido">${usuario.apellido}</td>
      <td data-label="Email">${usuario.email}</td>
      <td data-label="Edad">${edad}</td>
      <td data-label="Tipo de cuenta">${usuario.cuenta}</td>
      <td data-label="Saldo">$${usuario.saldo}</td>
      <td data-label="Última extracción">${usuario.ultimaExtraccion || "-"}</td>
    </tr>
  `;
}

// Botón volver
volverBtn.addEventListener("click", () => {
  window.location.href = "./usuario.html";
});
