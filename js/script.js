/* ===============================
   SCRIPT PARA AFP DIGITAL BANK
   =============================== */

/* ===============================
   MODALES (Login y Registro)
   =============================== */
const openLoginBtn = document.getElementById('openLoginBtn');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');
const loginCancel = document.getElementById('loginCancel');

const openRegisterBtn = document.getElementById('openRegisterBtn');
const registerModal = document.getElementById('registerModal');
const closeRegister = document.getElementById('closeRegister');
const registerCancel = document.getElementById('registerCancel');

openLoginBtn.addEventListener('click', () => {
  loginModal.setAttribute('aria-hidden', 'false');
});
closeLogin.addEventListener('click', () => {
  loginModal.setAttribute('aria-hidden', 'true');
});
loginCancel.addEventListener('click', () => {
  loginModal.setAttribute('aria-hidden', 'true');
});

openRegisterBtn.addEventListener('click', () => {
  registerModal.setAttribute('aria-hidden', 'false');
});
closeRegister.addEventListener('click', () => {
  registerModal.setAttribute('aria-hidden', 'true');
});
registerCancel.addEventListener('click', () => {
  registerModal.setAttribute('aria-hidden', 'true');
});

/* ===============================
   TOGGLE DE CONTRASEÑA
   =============================== */
const togglePassBtns = document.querySelectorAll('.toggle-pass');

togglePassBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetInput = document.getElementById(btn.dataset.target);
    if (targetInput.type === 'password') {
      targetInput.type = 'text';
      btn.innerHTML = '<i class="bi bi-eye-slash"></i>';
    } else {
      targetInput.type = 'password';
      btn.innerHTML = '<i class="bi bi-eye"></i>';
    }
  });
});

/* ===============================
   CARRUSEL
   =============================== */
const track = document.getElementById('track');
const slides = Array.from(track.children);
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');

let currentSlide = 0;

/* Crear indicadores dinámicamente */
slides.forEach((_, index) => {
  const button = document.createElement('button');
  if(index === 0) button.classList.add('active');
  button.addEventListener('click', () => goToSlide(index));
  indicatorsContainer.appendChild(button);
});

const indicators = Array.from(indicatorsContainer.children);

/* Función para cambiar de slide */
function goToSlide(index) {
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${slideWidth * index}px)`;
  currentSlide = index;
  updateIndicators();
}

/* Actualizar indicadores */
function updateIndicators() {
  indicators.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === currentSlide);
  });
}

/* Botones prev/next */
prevBtn.addEventListener('click', () => {
  const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  goToSlide(newIndex);
});

nextBtn.addEventListener('click', () => {
  const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
  goToSlide(newIndex);
});

/* Autoplay cada 5 segundos */
setInterval(() => {
  const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
  goToSlide(newIndex);
}, 5000);

/* ===============================
   FORMULARIOS (LOGIN Y REGISTRO)
   =============================== */
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

/* --- LOGIN --- */
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = loginForm.loginEmail.value.trim();
  const password = loginForm.loginPassword.value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if(!usuario){
    Swal.fire({
      icon: "error",
      title: "Usuario o contraseña incorrecta",
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  Swal.fire({
    title: `Bienvenido ${usuario.nombre}!`,
    icon: "success",
    timer: 1000,
    showConfirmButton: false,
    willClose: () => {
      localStorage.setItem("usuarioActual", email);
      loginModal.setAttribute('aria-hidden', 'true');
      loginForm.reset();

      // --- FORMULARIO TEMPORAL PARA DETECTAR GESTOR DE CONTRASEÑAS ---
      const tempForm = document.createElement('form');
      tempForm.style.display = 'none';
      tempForm.method = 'POST';
      tempForm.autocomplete = 'on';

      const tempEmail = document.createElement('input');
      tempEmail.type = 'email';
      tempEmail.name = 'username';
      tempEmail.value = email;
      tempEmail.autocomplete = 'username';
      tempForm.appendChild(tempEmail);

      const tempPass = document.createElement('input');
      tempPass.type = 'password';
      tempPass.name = 'current-password';
      tempPass.value = password;
      tempPass.autocomplete = 'current-password';
      tempForm.appendChild(tempPass);

      document.body.appendChild(tempForm);
      tempForm.submit(); // Dispara el prompt de guardar contraseña
      document.body.removeChild(tempForm);

      // Redirigir al usuario a su panel
      window.location.href = "./pages/usuario.html";
    }
  });
});

/* --- REGISTRO --- */
registerForm.addEventListener('submit', e => {
  e.preventDefault();

  const nombre = registerForm.regNombre.value.trim();
  const apellido = registerForm.regApellido.value.trim();
  const email = registerForm.regEmail.value.trim();
  const dni = registerForm.regDni.value.trim();
  const nacimiento = registerForm.regNacimiento.value;
  const cuenta = registerForm.regCuenta.value;
  const password = registerForm.regPassword.value;
  const confirm = registerForm.regConfirm.value;

  if(password !== confirm){
    Swal.fire({
      icon: "error",
      title: "Las contraseñas no coinciden",
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if(usuarios.some(u => u.email === email)){
    Swal.fire({
      icon: "error",
      title: "Email ya registrado",
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  usuarios.push({
    nombre, apellido, email, dni, nacimiento, cuenta,
    password, saldo:0, ultimaExtraccion:"-"
  });

  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  Swal.fire({
    title: `Usuario ${nombre} registrado!`,
    icon: "success",
    timer: 1000,
    showConfirmButton: false,
    willClose: () => {
      localStorage.setItem("usuarioActual", email);
      registerModal.setAttribute('aria-hidden', 'true');
      registerForm.reset();
      window.location.href = "./pages/usuario.html";
    }
  });
});
