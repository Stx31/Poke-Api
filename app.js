const listaPokemon = document.getElementById("listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

function obtenerGeneracionYRegionPokemon(speciesUrl) {
    return fetch(speciesUrl)
        .then(response => response.json())
        .then(data => {
            const generationUrl = data.generation.url;
            return fetch(generationUrl)
                .then(response => response.json())
                .then(generationData => {
                    const versionUrl = generationData.versions[0].url;
                    return fetch(versionUrl)
                        .then(response => response.json())
                        .then(versionData => {
                            const regionUrl = versionData.region.url;
                            return fetch(regionUrl)
                                .then(response => response.json())
                                .then(regionData => {
                                    const generacion = generationData.name || 'Desconocida';
                                    const region = regionData.name || 'Desconocida';
                                    return { generacion, region };
                                })
                                .catch(error => {
                                    console.error('Error fetching Pokémon region:', error);
                                    return { generacion: 'Desconocida', region: 'Desconocida' };
                                });
                        })
                        .catch(error => {
                            console.error('Error fetching Pokémon version:', error);
                            return { generacion: 'Desconocida', region: 'Desconocida' };
                        });
                })
                .catch(error => {
                    console.error('Error fetching Pokémon generation:', error);
                    return { generacion: 'Desconocida', region: 'Desconocida' };
                });
        })
        .catch(error => {
            console.error('Error fetching Pokémon species:', error);
            return { generacion: 'Desconocida', region: 'Desconocida' };
        });
}

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    obtenerGeneracionYRegionPokemon(poke.species.url)
        .then(({ generacion, region }) => {
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
                    </div>
                    <div class="pokemon-generacion">
                        <p class="generacion">Generación: ${generacion}</p>
                        <p class="region">Región: ${region}</p>
                    </div>
                </div>
            `;
            listaPokemon.append(div);
        })
        .catch(error => console.error('Error fetching Pokémon data:', error));
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                const generaciones = data.game_indices.map(game => `gen-${game.version_group.name.split("-").pop()}`);
                if (botonId === "ver-todos" || botonId === "gen-todos" || generaciones.includes(botonId) || data.types.some(type => type.type.name === botonId)) {
                    mostrarPokemon(data);
                }
            })
            .catch(error => console.error('Error fetching Pokémon:', error));
    }
}));
