const listaPokemon = document.querySelector("#listaPokemon");
const botonVerTodos = document.getElementById("ver-todos");
const filtroPokemonDiv = document.getElementById("filtroPokemon");
const botonCancelar = document.getElementById("cancelar");
const inputPokemon = document.getElementById("filtro-input");
let URL = "https://pokeapi.co/api/v2/pokemon/";

document.addEventListener("DOMContentLoaded", () => {
    botonCancelar.style.display = "none";
    cargarPokemon();
});

function cargarPokemon() {
    for (let i = 1; i <= 1008; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => mostrarPokemon(data))
            .catch(error => console.error("Error al cargar Pokémon:", error));
    }
}

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString().padStart(3, '0');

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
                <p class="stat">${game_indices}kg</p>
                
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonVerTodos.addEventListener("click", () => {
    listaPokemon.innerHTML = ""; 
    filtroPokemonDiv.style.display = "block";
    botonCancelar.style.display = "inline-block";
});

botonCancelar.addEventListener("click", () => {
    filtroPokemonDiv.style.display = "none";
    listaPokemon.innerHTML = ""; 
    botonCancelar.style.display = "none";
    inputPokemon.value = "";
});

inputPokemon.addEventListener("input", () => {
    const filtro = inputPokemon.value.trim().toLowerCase();
    if (filtro.length === 0) {
        listaPokemon.innerHTML = "";
        cargarPokemon();
    } else {
        filtrarPokemon(filtro);
    }
});

function filtrarPokemon(filtro) {
    fetch(`${URL}${filtro}`)
        .then((response) => response.json())
        .then(data => {
            listaPokemon.innerHTML = "";
            mostrarPokemon(data);
        })
        .catch(error => console.error("Pokémon no encontrado:", error));
}
