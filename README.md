function nivelDeEnamoramiento() {
    const niveles = [
        "Estás completamente enamorado.",
        "Tienes un flechazo.",
        "Te gusta un poco.",
        "No estás muy seguro de tus sentimientos.",
        "No estás enamorado en absoluto.",
        "Estás enamorado locamente.",
        "Te estás empezando a enamorar.",
        "Es complicado..."
    ];

    // Generar un número aleatorio entre 0 y el número de niveles disponibles
    const randomIndex = Math.floor(Math.random() * niveles.length);

    // Mostrar el resultado
    console.log(niveles[randomIndex]);
}

// Llamar a la función para ver el resultado
nivelDeEnamoramiento();
