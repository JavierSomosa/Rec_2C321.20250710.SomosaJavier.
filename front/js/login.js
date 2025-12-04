function loginRapido() {
    document.getElementById("login-email").value = "admin@admin.com";
    document.getElementById("login-pass").value = "1234";
}

function login() {
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-pass").value.trim();

    if (!email || !pass) {
      mostrarError("Completá ambos campos");
    return;
    }

  // Simulación temporal (hasta conectar al backend)
    if (email === "admin@admin.com" && pass === "1234") {
    localStorage.setItem("admin", "true");
    window.location.href = "admin.html";
    } else {
    mostrarError("Usuario o contraseña incorrectos");
    }
}

function mostrarError(msg) {
    const error = document.getElementById("login-error");
    error.textContent = msg;
}

