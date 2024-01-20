const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

function mostrarPokemon(poke) {
    const tipos = poke.types.map(type => type.type.name);
    const version = poke.game_indices[0].version.name;
    const imagenURL = poke.sprites.other["official-artwork"].front_default;
    const peso = poke.weight;
    const habilidades = poke.abilities.map(ability => ability.ability.name).join(', ');

    const div = document.createElement("div");
    div.classList.add("pokemon");


    tipos.forEach(tipo => {
        div.classList.add(tipo);
    });

    div.innerHTML = `
        <p class="pokemon-id">#${poke.id}</p>
        <div class="pokemon-imagen">
            <img src="${imagenURL}" alt="${poke.name}">
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

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 1000; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                const versiones = data.game_indices.map(game => game.version.name);
                const tipos = data.types.map(type => type.type.name);

                if (botonId === "ver-todos-versions" && versiones.some(v => Array.from(botonesHeader).map(btn => btn.id).includes(v.toLowerCase()))) {
                    mostrarPokemon(data);
                } else if ((versiones.includes(botonId) && botonId !== "ver-todos-versions") || botonId === "ver-todos-versions") {
                    mostrarPokemon(data);
                } else if (tipos.includes(botonId)) {
                    mostrarPokemon(data);
                }
            })
            .catch(error => console.error('Error fetching Pokémon:', error));
    }
}));

function filtrarPorPeso(min, max) {
    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 1000; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                const peso = data.weight;

                if (peso >= min && peso <= max) {
                    mostrarPokemon(data);
                }
            })
            .catch(error => console.error('Error fetching Pokémon:', error));
    }
}

botonesFiltroPeso.forEach(boton => {
    boton.addEventListener("click", () => {
        const min = Number(boton.getAttribute("data-min"));
        const max = Number(boton.getAttribute("data-max"));
        filtrarPorPeso(min, max);
    });
});