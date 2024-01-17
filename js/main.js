const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";
for (let i = 1; i <= 1000; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
        .catch(error => console.error('Error fetching Pokémon:', error));
}

function mostrarPokemon(poke) {
    const tipos = poke.types.map(type => type.type.name).join(', ');
    const version = poke.game_indices[0].version.name;
    const localidad = poke.location_area_encounters;
    const locationArea = localidad.includes("https://pokeapi.co/api/") ? "Not available" : localidad;

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${poke.id}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${poke.id}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                <p class="tipos">${tipos}</p>
            </div>
            <div class="pokemon-version-localidad">
                <p class="region">Version: ${version}</p>
                <p class="localidad">Localidad: ${poke.location_area_encounters}</p>
            
            </div>
        </div>
    `;
    listaPokemon.append(div);
    console.log(poke);
}


botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 1000; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                const versiones = data.game_indices.map(game => game.version.name);
                if ((versiones.includes(botonId) && botonId !== "versiones") || botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }
            })
            .catch(error => console.error('Error fetching Pokémon:', error));
    }
}));
