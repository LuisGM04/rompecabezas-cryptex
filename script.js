const palabraCryptex = "PLANTA";
const enigmas = [
    { pregunta: "Soy un número y mi doble es 4, ¿quién soy?", respuesta: "2" },
    { pregunta: "Tengo raíces, pero no soy un árbol. ¿Qué soy?", respuesta: "planta" },
    { pregunta: "El hermano del padre de tu tío, ¿quién es?", respuesta: "abuelo" }
];

// Variables
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let progreso = [];
let enigmaActual = 0;
let usuarioActual = null;

// Actualizar opciones de usuario
function actualizarUsuarios() {
    const selectExistente = document.getElementById("seleccion-usuario");
    const selectEliminar = document.getElementById("eliminar-usuario");

    [selectExistente, selectEliminar].forEach(select => {
        select.innerHTML = `<option value="" disabled selected>Selecciona un usuario</option>`;
        usuarios.forEach((u, i) => {
            select.innerHTML += `<option value="${i}">${u.nombre}</option>`;
        });
    });
}

// Registrar nuevo usuario
document.getElementById("registrar-usuario").addEventListener("click", () => {
    const nombre = document.getElementById("nuevo-nombre").value;
    const password = document.getElementById("nuevo-password").value;

    if (nombre && password) {
        usuarios.push({ nombre, password });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("Usuario registrado.");
        actualizarUsuarios();

        // Limpieza de campos
        document.getElementById("nuevo-nombre").value = "";
        document.getElementById("nuevo-password").value = "";
    } else {
        alert("Completa ambos campos.");
    }
});

// Validar y continuar
document.getElementById("continuar").addEventListener("click", () => {
    const index = document.getElementById("seleccion-usuario").value;
    const password = document.getElementById("login-password").value;

    if (index && usuarios[index].password === password) {
        usuarioActual = usuarios[index].nombre;
        progreso = JSON.parse(localStorage.getItem(`${usuarioActual}_progreso`)) || Array(palabraCryptex.length).fill("_");
        enigmaActual = JSON.parse(localStorage.getItem(`${usuarioActual}_enigmaActual`)) || 0;
        document.getElementById("menu").style.display = "none";
        document.getElementById("enigmas").style.display = "block";
        cargarEnigma();

        // Limpieza de campos del menú
        document.getElementById("seleccion-usuario").value = "";
        document.getElementById("login-password").value = "";
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});

// Eliminar un usuario y su progreso
document.getElementById("eliminar-usuario-btn").addEventListener("click", () => {
    const index = document.getElementById("eliminar-usuario").value;

    if (index) {
        const eliminado = usuarios.splice(index, 1); // Elimina del array
        localStorage.removeItem(`${eliminado[0].nombre}_progreso`); // Borra progreso
        localStorage.removeItem(`${eliminado[0].nombre}_enigmaActual`); // Borra estado del enigma
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert(`Usuario "${eliminado[0].nombre}" y su progreso han sido eliminados.`);
        actualizarUsuarios();
    } else {
        alert("Selecciona un usuario para eliminar.");
    }
});

// Botón "Volver al Menú"
document.getElementById("volver-menu").addEventListener("click", () => {
    if (confirm("¿Seguro que deseas volver al menú? Tu progreso actual no se perderá.")) {
        document.getElementById("enigmas").style.display = "none";
        document.getElementById("menu").style.display = "block";

        // Limpieza de campos en el menú
        document.getElementById("seleccion-usuario").value = "";
        document.getElementById("login-password").value = "";
    }
});

// Cargar enigmas
function cargarEnigma() {
    document.getElementById("pregunta").textContent = enigmas[enigmaActual].pregunta;
    document.getElementById("progreso-container").innerHTML = progreso.map(l => `<span>${l}</span>`).join("");

    // Limpieza del campo de respuesta
    document.getElementById("respuesta").value = "";
}

document.getElementById("verificar").addEventListener("click", () => {
    const respuesta = document.getElementById("respuesta").value.toLowerCase();

    if (respuesta === enigmas[enigmaActual].respuesta) {
        progreso[enigmaActual] = palabraCryptex[enigmaActual].toUpperCase();
        enigmaActual++;
        localStorage.setItem(`${usuarioActual}_progreso`, JSON.stringify(progreso));
        localStorage.setItem(`${usuarioActual}_enigmaActual`, JSON.stringify(enigmaActual));

        if (enigmaActual < enigmas.length) {
            cargarEnigma(); // Limpia el campo automáticamente
        } else {
            alert("¡Has completado el Cryptex!");
            document.getElementById("respuesta").value = ""; // Limpia el campo tras completar el juego
        }
    } else {
        alert("Respuesta incorrecta.");
        document.getElementById("respuesta").value = ""; // Limpia el campo tras una respuesta incorrecta
    }
});

// Inicializar
actualizarUsuarios();
