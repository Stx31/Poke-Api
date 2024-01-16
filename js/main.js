const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

async function fetchAndDisplayPokemon(url, tipo, version) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.types && data.game_indices) {
            if (tipo === "ver-todos" || data.types.some(type => type.type.name === tipo)) {
                if (!version || (version && Array.isArray(data.game_indices) && data.game_indices.some(game => game.version.name.toLowerCase() === version))) {
                    const region = await obtenerRegion(data.game_indices);
                    mostrarPokemon(data, region);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}

async function obtenerRegion(gameIndices) {
    const versionUrl = gameIndices[0].version.url;
    const response = await fetch(versionUrl);
    const versionData = await response.json();
    return versionData.main_region.name;
}

function mostrarPokemon(poke, region) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');

    let pokeId = poke.id.toString().padStart(3, '0');

    const div = document.createElement("div");
    div.classList.add("pokemon");

    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other['official-artwork'].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                Tipos: ${tipos}
            </div>
            <div class="pokemon-region">
                Región: ${region}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height / 10}m</p>
                <p class="stat">${poke.weight / 10}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const tipo = event.currentTarget.dataset.type;
    const version = event.currentTarget.dataset.version;

    listaPokemon.innerHTML = "";

    (async () => {
        for (let i = 1; i <= 300; i++) {
            await fetchAndDisplayPokemon(URL + i, tipo, version);
        }
    })();
}));
