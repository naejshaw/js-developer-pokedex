const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151;
const limit = 15;
let offset = 0;

function convertPokemonToLi(pokemon){
    return `
    <li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
                
        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                
            </ol>
          
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
        <div class="pokeballBg">
            <img src="/assets/pokeball.png">
        </div>
    </li>
`
}

function loadPokemonItens(offset, limit){
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => { 
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNextPage = offset + limit

    if (qtdRecordsWithNextPage >= maxRecords){
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else{
        loadPokemonItens(offset, limit)
    }
})


// Criação de pop-up

function createPokemonDetailPopup(pokemon) {
    const popup = document.createElement('div');
    popup.classList.add('pokemon-popup');

    popup.addEventListener('click', () => {        
        popup.remove();
    });

    const popupContent = document.createElement('div');
    popupContent.classList.toggle(`${pokemon.type}`);
    popupContent.classList.add('popup-content');
    
    const popupImg = document.createElement('img');
    popupImg.src = pokemon.popupPhoto;
    popupImg.alt = pokemon.name;

    const popupName = document.createElement('h2');
    popupName.innerText = pokemon.name;

    const popupNumber = document.createElement('p');
    popupNumber.innerText = `#${pokemon.number}`;

    const popupHeight = document.createElement('p');
    popupHeight.innerText = `${pokemon.height} in`;

    const popupWeight = document.createElement('p');
    popupWeight.innerText = `${pokemon.weight} lb`;

    const popupStat = document.createElement('ul');
    popupStat.innerHTML = `${pokemon.stat.map((stat) => `<li class="stat">${stat}</li>`).join('')}`;
    
    const popupStats = document.createElement('ul');
    popupStats.innerHTML = `${pokemon.stats.map((stats) => `<li class="stats">${stats}</li>`).join('')}`;

    const popupTypes = document.createElement('ul');
    popupTypes.innerHTML = `${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}`;
    
    popupContent.appendChild(popupImg);
    popupContent.appendChild(popupName);
    popupContent.appendChild(popupNumber);
    popupContent.appendChild(popupTypes);
    popupContent.appendChild(popupHeight);
    popupContent.appendChild(popupWeight);
    popupContent.appendChild(popupStat);
    popupContent.appendChild(popupStats);
    
    popup.appendChild(popupContent);

    document.body.appendChild(popup);
}

pokemonList.addEventListener('click', (event) => {
    const pokemonElement = event.target.closest('.pokemon');
    if (pokemonElement) {
        const pokemonName = pokemonElement.querySelector('.name').innerText;
        
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then((response) => response.json())
            .then((pokeDetail) => {
                const pokemon = convertPokeApiDetailToPokemon(pokeDetail);
                createPokemonDetailPopup(pokemon);
            })
            .catch((error) => {
                console.error('Error fetching Pokémon details:', error);
            });
    }
});


