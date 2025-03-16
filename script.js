// script.js
const palabraCryptex = "CONSTELACIONES";
const signos = {
    A: "▲", B: "■", C: "●", D: "♦", E: "★", F: "♣", G: "♠", H: "☀", I: "☽",
    J: "✈", K: "✂", L: "♪", M: "☁", N: "☂", O: "⚙", P: "⚡", Q: "♔", R: "♕",
    S: "☘", T: "⚓", U: "✿", V: "☯", W: "⚽", X: "✖", Y: "☎", Z: "✉"
};

const enigmas = [
    { pregunta: "¿Cuántos lunares tiene tu novio en el cuerpo?", respuesta: "156", pista: "Cuéntalos ;)" },
    { pregunta: "Me puedes romper sin tocarme. ¿Qué soy?", respuesta: "promesa", pista: "Es algo que haces con palabras." },
    { pregunta: "Siempre subo pero nunca bajo", respuesta: "edad", pista: "Todas las personas la tienen." },
    { pregunta: "La Plaza Mayor, ¡que icónico sitio de Madrid! Pero, ¿cuántos ventanales tendrá? Ve y cuéntalos.", respuesta: "371", pista: "Cuenta despacio." },
    { pregunta: "Te sigo a donde vayas, pero no soy un ser vivo. ¿Qué soy?", respuesta: "sombra", pista: "Aparece bajo el sol." },
    { pregunta: "Me encanta jugar a los bolos, pero no se si cabríamos todos en las pistas. ¿Cuántas pistas de bolos tiene el Equinoccio? Cuéntalas, ve a jugar una partida y pregunta a tu acompañante por un número, la respuesta es la suma de las pistas más el número proporcionado", respuesta: "793", pista: "Juega." },
    { pregunta: "Tengo cuello pero no cabeza.", respuesta: "botella", pista: "Puedes guardar cosas en eso." },
    { pregunta: "La cena del siglo. Eres una espía y te han invitado a una cena, te has de vestir de gala para no levantar sospechas. Ve y averigua cual es el código de la caja fuerte, la respuesta serán los 4 dígitos que tendrás que sacarle al mafioso.", respuesta: "2759", pista: "Habla con él." },
    { pregunta: "En una sala hay un reloj mágico que tiene tres manecillas: una azul, una roja y una verde. Cada vez que la manecilla azul se mueve, la roja también se mueve, pero al doble de velocidad. Cada vez que la manecilla verde se mueve, la azul también lo hace, pero al triple de velocidad. En una vuelta completa de la manecilla verde, ¿cuántas vueltas dará la manecilla roja?", respuesta: "6", pista: "Piensa en proporciones y velocidades. ¿Qué pasa si cada manecilla influye en las otras?" },
    { pregunta: "Me pregunto cuántas columnas tendrá el patio central del Palacio Real. Ve al palacio, haz una visita, sitúate en el centro y cuénta cuantas ves desde allí (solo ten en cuenta las columnas que más resalten). La respuesta será multiplicando el número de columnas por 3.", respuesta: "66", pista: "Ponte en el centro y cuenta." },
    { pregunta: "En una calle hay cinco casas de diferentes colores, habitadas por personas de diferentes nacionalidades. Cada persona bebe una bebida diferente, fuma una marca de cigarrillos diferente y tiene una mascota distinta. El inglés vive en la casa roja. El sueco tiene un perro. El danés bebe té. La casa verde está justo a la izquierda de la casa blanca. El dueño de la casa verde bebe café. La persona que fuma Pall Mall tiene un pájaro. El dueño de la casa amarilla fuma Dunhill. El hombre que vive en la casa del centro bebe leche. El noruego vive en la primera casa. El hombre que fuma Blends vive al lado del que tiene gatos. El hombre que tiene caballos vive al lado del que fuma Dunhill. El hombre que fuma Blue Master bebe cerveza. El alemán fuma Prince. El noruego vive al lado de la casa azul. El hombre que fuma Blends tiene un vecino que bebe agua. ¿Quién tiene el pez?", respuesta: "el aleman", pista: "Haz una tabla con los datos" },
    { pregunta: "Los antiguos Reyes de España escondían un secreto, y como eres la famosa historiadora Maria M.M. lo tienes que averiguar. Para esta ruta te acompañará tu guia, con el que llevas trabajando 3 años, él te llevará y te ayudará a conseguir la respuesta al gran secreto Real. Lleva ropa cómoda porque habrá que adentrarse por el bosque.", respuesta: "cervantes", pista: "Ve a la silla de Felipe II" }, //cervantes fue un espía encubierto de Felipe II
    { pregunta: "Soy más fuerte que el acero pero al agua le temo. ¿Qué soy?", respuesta: "papel", pista: "Se usa para escribir." },
    { pregunta: "¿Cuántas playas tienen las Islas Cíes? Ve a visitarlas para contarlas", respuesta: "9", pista: "Ve a las Cíes" }
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
