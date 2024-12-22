const palabraCryptex = "CONSTELACION";
const signos = {
    A: "▲", B: "■", C: "●", D: "♦", E: "★", F: "♣", G: "♠", H: "☀", I: "☽",
    J: "✈", K: "✂", L: "♪", M: "☁", N: "☂", O: "⚙", P: "⚡", Q: "♔", R: "♕",
    S: "☘", T: "⚓", U: "✿", V: "☯", W: "⚽", X: "✖", Y: "☎", Z: "✉"
};

const enigmas = [
    { pregunta: "Soy un número y mi doble es 4, ¿quién soy?", respuesta: "2", pista: "Es un número." },
    { pregunta: "Tengo raíces, pero no soy un árbol. ¿Qué soy?", respuesta: "planta", pista: "Es algo que puede crecer en una maceta." },
    { pregunta: "El hermano del padre de tu tío, ¿quién es?", respuesta: "abuelo", pista: "Es un miembro de la familia." },
    { pregunta: "Siempre subo pero nunca bajo, ¿quién soy?", respuesta: "edad", pista: "Es algo que cambia con el tiempo." },
    { pregunta: "Tengo cuello pero no cabeza, ¿qué soy?", respuesta: "botella", pista: "Sirve para guardar líquidos." },
    { pregunta: "Mientras más seco, más mojo. ¿Qué soy?", respuesta: "toalla", pista: "Se usa después de bañarse." },
    { pregunta: "Siempre me verás al principio de todo. ¿Qué soy?", respuesta: "a", pista: "Es la primera letra del abecedario." },
    { pregunta: "Me puedes romper sin tocarme. ¿Qué soy?", respuesta: "promesa", pista: "Es algo que haces con palabras." },
    { pregunta: "Te sigo a donde vayas, pero no soy un ser vivo. ¿Qué soy?", respuesta: "sombra", pista: "Aparece bajo el sol." },
    { pregunta: "Cuento cada segundo y no tengo manos. ¿Qué soy?", respuesta: "reloj", pista: "Está presente en todas las casas." },
    { pregunta: "Soy más fuerte que el acero pero al agua le temo. ¿Qué soy?", respuesta: "papel", pista: "Se usa para escribir." },
    { pregunta: "Soy pequeño, redondo, pero sin mí no puedes caminar. ¿Qué soy?", respuesta: "zapato", pista: "Se encuentra en los pies." }
];

// Variables
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let progreso = [];
let pistasRestantes = 3;
let enigmaActual = 0;
let usuarioActual = null;
let pistaMostrada = false;

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
        pistasRestantes = JSON.parse(localStorage.getItem(`${usuarioActual}_pistas`)) ?? 3;
        pistaMostrada = JSON.parse(localStorage.getItem(`${usuarioActual}_pistaMostrada_${enigmaActual}`)) || false;

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
        const nombreUsuario = eliminado[0].nombre;
        localStorage.removeItem(`${nombreUsuario}_progreso`); // Borra progreso
        localStorage.removeItem(`${nombreUsuario}_enigmaActual`); // Borra estado del enigma
        localStorage.removeItem(`${nombreUsuario}_pistas`); // Borra uso de pistas

        // Remover todas las pistas mostradas para todos los enigmas
        enigmas.forEach((_, enigmaIndex) => {
            localStorage.removeItem(`${nombreUsuario}_pistaMostrada_${enigmaIndex}`);
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert(`Usuario "${nombreUsuario}" y su progreso han sido eliminados.`);
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
    document.getElementById("progreso-container").innerHTML = progreso.map(l => `<span>${signos[l] || "_"}</span>`).join("");

    // Mostrar pista si ya fue utilizada
    if (pistaMostrada) {
        document.getElementById("pista-mostrada").textContent = `Pista: ${enigmas[enigmaActual].pista}`;
    } else {
        document.getElementById("pista-mostrada").textContent = "";
    }

    // Limpieza del campo de respuesta
    document.getElementById("respuesta").value = "";
    document.getElementById("pista").textContent = `Pista (${pistasRestantes} disponibles)`;
}

// Verificar respuesta
document.getElementById("verificar").addEventListener("click", () => {
    const respuesta = document.getElementById("respuesta").value.toLowerCase();

    if (respuesta === enigmas[enigmaActual].respuesta) {
        progreso[enigmaActual] = palabraCryptex[enigmaActual].toUpperCase();
        enigmaActual++;
        pistaMostrada = false; // Reinicia para el siguiente enigma
        localStorage.setItem(`${usuarioActual}_progreso`, JSON.stringify(progreso));
        localStorage.setItem(`${usuarioActual}_enigmaActual`, JSON.stringify(enigmaActual));
        localStorage.setItem(`${usuarioActual}_pistaMostrada_${enigmaActual}`, JSON.stringify(pistaMostrada));

        if (enigmaActual < enigmas.length) {
            cargarEnigma();
        } else {
            alert("¡Has completado el Cryptex!");
            document.getElementById("enigmas").style.display = "none";
            mostrarIngresoPalabra();
        }
    } else {
        alert("Respuesta incorrecta.");
        document.getElementById("respuesta").value = ""; // Limpia el campo tras una respuesta incorrecta
    }
});

// Botón de pistas
document.getElementById("pista").addEventListener("click", () => {
    if (!pistaMostrada) {
        if (pistasRestantes > 0) {
            alert(`Pista: ${enigmas[enigmaActual].pista}`);
            pistasRestantes--;
            pistaMostrada = true;
            localStorage.setItem(`${usuarioActual}_pistas`, JSON.stringify(pistasRestantes));
            localStorage.setItem(`${usuarioActual}_pistaMostrada_${enigmaActual}`, JSON.stringify(pistaMostrada));
            document.getElementById("pista").textContent = `Pista (${pistasRestantes} disponibles)`;
            document.getElementById("pista-mostrada").textContent = `Pista: ${enigmas[enigmaActual].pista}`;
        } else {
            alert("Ya has usado todas tus pistas disponibles.");
        }
    } else {
        alert("Ya has usado la pista para este enigma.");
    }
});

// Mostrar la ventana de ingreso de palabra
function mostrarIngresoPalabra() {
    document.getElementById("enigmas").style.display = "none";
    document.getElementById("ingreso-palabra").style.display = "block";
    //Generar la palabra formada por signos
    const palabraSignos = progreso.map(letra => signos[letra] || "_").join(" ");
    document.getElementById("palabra-signos").textContent = palabraSignos;
}

// Verificar la palabra ingresada y mostrar el código final
document.getElementById("finalizar").addEventListener("click", () => {
    const palabraIngresada = document.getElementById("palabra-final").value.toUpperCase();
    if (palabraIngresada === palabraCryptex) {
        document.getElementById("ingreso-palabra").style.display = "none";
        document.getElementById("codigo-final").style.display = "block";
    } else {
        alert("La palabra ingresada es incorrecta. Inténtalo de nuevo.");
    }
});

// Volver al menú desde la ventana final
document.getElementById("volver-menu-final").addEventListener("click", () => {
    document.getElementById("codigo-final").style.display = "none";
    document.getElementById("menu").style.display = "block";
});

// Inicializar
actualizarUsuarios();
