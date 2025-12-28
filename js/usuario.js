document.addEventListener("DOMContentLoaded", () => {
  const userNombre = document.getElementById("userNombre");
  const userApellido = document.getElementById("userApellido");

  const cargarBtn = document.getElementById("cargarBtn");
  const modificarBtn = document.getElementById("modificarBtn");
  const consultarBtn = document.getElementById("consultarBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Traer usuario actual
  let usuarioActual = localStorage.getItem("usuarioActual");
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let usuario = usuarios.find(u => u.email === usuarioActual);

  // Si no hay sesión, volver al index
  if(!usuario){
    window.location.href = "../index.html";
  } else {
    userNombre.textContent = `Bienvenido ${usuario.nombre}`;
    userApellido.textContent = `${usuario.apellido}`;
  }

  // --- Cargar dinero ---
  cargarBtn.addEventListener("click", () => {
  Swal.fire({
    title: 'Ingrese monto a depositar',
    html: `<p>Saldo actual: $${usuario.saldo}</p>`,
    input: 'number',
    inputAttributes: { min: 0 },
    showCancelButton: true,
    didOpen: () => {
      const input = Swal.getInput();
      input.value = ""; 
      input.addEventListener("focus", () => input.value = "");
    }
  }).then(result => {
    if(result.value){
      usuario.saldo = parseFloat(usuario.saldo) + parseFloat(result.value);
      guardarUsuario();
      Swal.fire({
        icon: 'success',
        title: 'Depósito exitoso',
        text: `Saldo actual: $${usuario.saldo}`,
        timer: 1000,
        showConfirmButton: false
      });
    }
  });
});

  // --- Retirar dinero ---
 modificarBtn.addEventListener("click", () => {
  Swal.fire({
    title: 'Ingrese monto a retirar',
    html: `<p>Saldo disponible: $${usuario.saldo}</p>`,
    input: 'number',
    inputAttributes: { min: 0, max: usuario.saldo },
    showCancelButton: true,
    didOpen: () => {
      const input = Swal.getInput();
      input.value = "";
      input.addEventListener("focus", () => input.value = "");
    }
  }).then(result => {
    if(result.value){
      let monto = parseFloat(result.value);
      if(monto > usuario.saldo){
        Swal.fire("Error","Saldo insuficiente","error");
        return;
      }
      usuario.saldo -= monto;
      usuario.ultimaExtraccion = new Date().toLocaleString();
      guardarUsuario();
      Swal.fire({
        icon: 'success',
        title: 'Retiro exitoso',
        text: `Saldo actual: $${usuario.saldo}`,
        timer: 1000,
        showConfirmButton: false
      });
    }
  });
});


  // --- Consultar información ---
  consultarBtn.addEventListener("click", () => {
    window.location.href = "./info.html";
  });

  // --- Cerrar sesión ---
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioActual");
    window.location.href = "../index.html";
  });

  // --- Guardar cambios en localStorage ---
  function guardarUsuario(){
    let index = usuarios.findIndex(u => u.email === usuario.email);
    usuarios[index] = usuario;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
});
