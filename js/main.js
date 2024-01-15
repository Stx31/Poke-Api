const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";
const regionURL = "https://pokeapi.co/api/v2/region/4/";
const encountersURL = "https://pokeapi.co/api/v2/pokemon/1/encounters"; // Cambia esto según tus necesidades
const locationsURL = "https://pokeapi.co/api/v2/pokemon/1/encounters"; // Cambia esto según tus necesidades

fetch(regionURL)
    .then((response) => response.json())
    .then((regionData) => {
        const sinnohPokemonURL = regionData.pokemon_species.map((pokemon) => pokemon.url);
       
        sinnohPokemonURL.forEach((url) => {
            fetch(url)
                .then((response) => response.json())
                .then((data) => mostrarPokemon(data));
        });
    });

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
                ${poke.location_area ? `<p class="location">${poke.location_area.name}</p>` : ''}
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = "";

    if (botonId === "ver-todos") {
        for (let i = 1; i <= 151; i++) {
            fetch(URL + i)
                .then((response) => response.json())
                .then(data => mostrarPokemon(data));
        }
    } else if (botonId === "sinnoh") {
        fetch(regionURL)
            .then((response) => response.json())
            .then((regionData) => {
                const sinnohPokemonURL = regionData.pokemon_species.map((pokemon) => pokemon.url);
                sinnohPokemonURL.forEach((url) => {
                    fetch(url)
                        .then((response) => response.json())
                        .then((data) => mostrarPokemon(data));
                });
            });
    } else if (botonId === "encounters") {
        fetch(encountersURL)
            .then((response) => response.json())
            .then((encountersData) => {
                const encounteredPokemonURLs = encountersData.map((encounter) => encounter.pokemon.url);
                encounteredPokemonURLs.forEach((url) => {
                    fetch(url)
                        .then((response) => response.json())
                        .then((data) => mostrarPokemon(data));
                });
            });
    } else if (botonId === "locations") {
        fetch(locationsURL)
            .then((response) => response.json())
            .then((locationsData) => {
                const locationPokemonURLs = locationsData.map((location) => location.pokemon_encounters[0].pokemon.url);
                locationPokemonURLs.forEach((url) => {
                    fetch(url)
                        .then((response) => response.json())
                        .then((data) => mostrarPokemon(data));
                });
            });
    } else {
        for (let i = 1; i <= 151; i++) {
            fetch(URL + i)
                .then((response) => response.json())
                .then(data => {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                });
        }
    }
}));
