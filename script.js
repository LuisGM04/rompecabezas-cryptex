document.addEventListener("DOMContentLoaded", () => {
    // Configuración dinámica del cryptex
    const palabraCryptex = "PLANTA"; // Define la palabra final
    const enigmas = [
        { id: 1, pregunta: "Soy un número y mi doble es 4, ¿quién soy?", respuesta: "2" },
        { id: 2, pregunta: "Tengo raíces, pero no soy un árbol. ¿Qué soy?", respuesta: "planta" },
        { id: 3, pregunta: "El hermano del padre de tu tío, ¿quién es?", respuesta: "abuelo" },
        { id: 4, pregunta: "No tengo alas pero puedo volar, ¿qué soy?", respuesta: "cometa" },
        { id: 5, pregunta: "Siempre subo pero nunca bajo, ¿qué soy?", respuesta: "edad" },
        { id: 6, pregunta: "Blanca por dentro, verde por fuera. Si quieres que te lo diga, espera.", respuesta: "pera" }
    ];

    // Validar número de enigmas
    if (enigmas.length !== palabraCryptex.length) {
        alert("Error: El número de enigmas debe coincidir con las letras del cryptex.");
    }

    // Variables globales
    let progreso = Array(palabraCryptex.length).fill("_");
    let enigmaActual = 0;

    // Mostrar enigma inicial
    function cargarEnigma() {
        const pregunta = document.getElementById("pregunta");
        pregunta.textContent = enigmas[enigmaActual].pregunta;
    }

    // Verificar respuesta
    function verificarRespuesta() {
        const respuestaInput = document.getElementById("respuesta").value.toLowerCase();
        const progresoContainer = document.getElementById("progreso-container");

        if (respuestaInput === enigmas[enigmaActual].respuesta) {
            progreso[enigmaActual] = palabraCryptex[enigmaActual].toUpperCase();
            progresoContainer.innerHTML = progreso
                .map((letra) => `<span>${letra}</span>`)
                .join("");

            enigmaActual++;
            document.getElementById("respuesta").value = "";

            if (enigmaActual < enigmas.length) {
                cargarEnigma();
            } else {
                alert("¡Has desbloqueado el cryptex!");
            }
        } else {
            alert("Respuesta incorrecta. Intenta de nuevo.");
        }
    }

    // Inicialización
    cargarEnigma();
    document.getElementById("progreso-container").innerHTML = progreso
        .map((letra) => `<span>${letra}</span>`)
        .join("");

    document.getElementById("verificar").addEventListener("click", verificarRespuesta);
});
