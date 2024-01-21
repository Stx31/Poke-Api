const listaPokemon = document.querySelector("#listaPokemon");
const filterButtons = document.querySelectorAll(".filter-button");
const URL = "https://pokeapi.co/api/v2/pokemon/";

function displayPokemon(poke) {
    const tipos = poke.types.map(type => type.type.name);
    const version = poke.game_indices[0].version.name;
    const imagenURL = poke.sprites.other["official-artwork"].front_default;
    const peso = poke.weight;
    const habilidades = poke.abilities.map(ability => ability.ability.name).join(', ');

    const breveExplicacion = "este pokemon contiene varias estadisitcas y se suele encontar en ";

    const div = document.createElement("div");
    div.classList.add("pokemon");

    tipos.forEach(tipo => {
        div.classList.add(tipo);
    });

    div.innerHTML = `
        <p class="pokemon-id">#${poke.id}</p>
        <div class="pokemon-imagen">
            <img src="${imagenURL}" alt="${poke.name}" title="Este Pokémon es el número ${poke.id}. ${breveExplicacion}">
            <div class="pokemon-tooltip">
                <p>${breveExplicacion}</p>
            </div>
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${poke.id}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                <p class="tipos">${tipos.join(', ')}</p>
            </div>
            <div class="pokemon-version-localidad">
                <p class="version">Versión: ${version}</p>
            </div>
            <div class="pokemon-peso">
                <p class="peso">Peso: ${peso} kg</p>
            </div>
            <div class="pokemon-habilidades">
                <p class="habilidades">Habilidades: ${habilidades}</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

function fetchDataAndDisplay(i) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => {
            displayPokemon(data);
        })
        .catch(error => console.error('Error al obtener Pokémon:', error));
}

function filterByWeight(min, max) {
    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 1000; i++) {
        fetchDataAndDisplay(i);
    }
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const min = Number(button.getAttribute("data-min"));
        const max = Number(button.getAttribute("data-max"));
        filterByWeight(min, max);
    });
});

document.querySelectorAll(".btn-header").forEach(boton => {
    boton.addEventListener("click", (event) => {
        const botonId = event.currentTarget.id;
        listaPokemon.innerHTML = "";

        for (let i = 1; i <= 1000; i++) {
            fetchDataAndDisplay(i);
        }
    });
});


document.querySelectorAll(".pokemon-imagen img").forEach(img => {
    img.addEventListener("mouseenter", () => {
        img.style.transform = "scale(1.2)";
    });

    img.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1)";
    });
});
