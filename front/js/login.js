function loginRapido() {
    document.getElementById("login-email").value = "admin@admin.com";
    document.getElementById("login-pass").value = "1234";
}

function login() {
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-pass").value.trim();

    if (!email || !pass) {
    alert("Completá ambos campos");
    return;
    }

  // Simulación temporal (hasta conectar al backend)
    if (email === "admin@admin.com" && pass === "1234") {
    localStorage.setItem("admin", "true");
    window.location.href = "admin.html";
    } else {
    alert("Usuario o contraseña incorrectos");
    }
}
