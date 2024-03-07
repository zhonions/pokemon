// Função para buscar os detalhes de um Pokémon específico
async function getPokemonDetails(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    if (!response.ok) {
      throw new Error("Não foi possível obter os detalhes do Pokémon");
    }
    const pokemonData = await response.json();
    return pokemonData;
  } catch (error) {
    console.error("Erro ao buscar os detalhes do Pokémon:", error.message);
  }
}

function getTypeColor(type) {
  return getComputedStyle(document.documentElement).getPropertyValue(
    `--${type}-color`
  );
}

async function displayPokemon(pokemonName) {
  try {
    const pokemonDetails = await getPokemonDetails(pokemonName);
    const pokemonContainer = document.getElementById("pokemonContainer");

    const pokemonDiv = document.createElement("div");
    pokemonDiv.classList.add("pokemon");

    const type = pokemonDetails.types[0].type.name;
    pokemonDiv.style.backgroundColor = getTypeColor(type);

    const pokemonImage = document.createElement("img");
    pokemonImage.src = pokemonDetails.sprites.front_default;
    pokemonImage.alt = pokemonDetails.name;
    pokemonDiv.appendChild(pokemonImage);

    const pokemonNameElement = document.createElement("p");
    pokemonNameElement.classList.add("pokemon-name");
    pokemonNameElement.textContent = capitalizeFirstLetter(pokemonDetails.name);
    pokemonDiv.appendChild(pokemonNameElement);

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const typesElement = document.createElement("p");
    typesElement.textContent = pokemonDetails.types
        .map((type) => type.type.name)
        .join(", ");
    pokemonDiv.appendChild(typesElement);
    

    const attributesList = document.createElement("ul");
    attributesList.classList.add("attributes-list");

    const attributes = {
      HP: pokemonDetails.stats[0].base_stat,
      Attack: pokemonDetails.stats[1].base_stat,
      Defense: pokemonDetails.stats[2].base_stat,
      "Special Attack": pokemonDetails.stats[3].base_stat,
      "Special Defense": pokemonDetails.stats[4].base_stat,
      Speed: pokemonDetails.stats[5].base_stat,
      Height: pokemonDetails.height,
      Weight: pokemonDetails.weight,
    };

    for (const key in attributes) {
      const attributeItem = document.createElement("li");
      attributeItem.textContent = `${key}: ${attributes[key]}`;
      attributesList.appendChild(attributeItem);
    }

    pokemonDiv.appendChild(attributesList);

    const abilitiesList = document.createElement("ul");
    abilitiesList.classList.add("abilities-list");
    
    for (const ability of pokemonDetails.abilities) {
      const abilityItem = document.createElement("div");
      abilityItem.classList.add("ability");

      const abilityNameElement = document.createElement("span");
      abilityNameElement.classList.add("ability-name");
      abilityNameElement.textContent = ability.is_hidden
        ? `Hidden Ability: `
        : `Ability: `;
      abilityItem.appendChild(abilityNameElement);

      const abilityTextElement = document.createElement("span");
      abilityTextElement.classList.add("ability-text");
      abilityTextElement.textContent = ability.ability.name;
      abilityItem.appendChild(abilityTextElement);

      abilitiesList.appendChild(abilityItem);
    }

    pokemonDiv.appendChild(abilitiesList);

    pokemonContainer.appendChild(pokemonDiv);
  } catch (error) {
    console.error("Erro ao exibir os detalhes do Pokémon:", error.message);
  }
}

async function getAllPokemonDetails() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151"); // Altere o limite conforme necessário
    if (!response.ok) {
      throw new Error("Não foi possível obter os detalhes dos Pokémon");
    }
    const pokemonList = await response.json();
    for (const pokemon of pokemonList.results) {
      await displayPokemon(pokemon.name);
    }
  } catch (error) {
    console.error("Erro ao buscar os detalhes dos Pokémon:", error.message);
  }
}

getAllPokemonDetails();
