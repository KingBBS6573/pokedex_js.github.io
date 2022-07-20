const search_input = document.querySelector(".recherche_poke input");
const liste_poke = document.querySelector(".liste_poke");
const chargement = document.querySelector(".loader");
let all_pokemon = [];
let all_pokemon_fr = [];

const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6',
    dark: '#654321'
};

//function ayant une requete permettant de recuperer les caracteristiques de bases d'un pokemon

function fetchPokemonBase() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=200")
        .then(response => response.json())
        .then((all_poke) => {
            console.log(all_poke);
            all_poke.results.forEach((pokemon) => {
                fetchPokemonComplet(pokemon);
            });
        })
}

fetchPokemonBase();

//function permettant d'avoir toutes les caracteristiques possibles d'un pokemon

function fetchPokemonComplet(pokemon){
    let obj_pokemon = {};
    let url_pokemon = pokemon.url;
    let name_pokemon = pokemon.name;

    //requete permettant de recuperer l'URL d'un pokemon afin de prendre son nom, son type  

    fetch(url_pokemon)
        .then(response => response.json())
        .then((poke_data) => {
            // console.log(poke_data);

            obj_pokemon.pic = poke_data.sprites.front_default;
            obj_pokemon.type = poke_data.types[0].type.name;
            obj_pokemon.id = poke_data.id;
        
        // requete permettant de recuperer le nom en francais d'un pokemon en fonction de son nom japonais

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${name_pokemon}`)
            .then(response => response.json())
            .then((poke_data) => {
                // console.log(poke_data);

                obj_pokemon.name = poke_data.names[4].name;
                all_pokemon_fr.push(obj_pokemon);

                if(all_pokemon_fr.length === 200) {
                    // console.log(all_pokemon_fr);
                    all_pokemon = all_pokemon_fr.sort((a,b) => {
                        return a.id - b.id;
                    }).slice(0,21);
                    // console.log(all_pokemon);

                    createCard(all_pokemon);
                    chargement.style.display = 'none';
                }
            })
        })
}

function createCard(tab) {
    for(let i=0; i<tab.length;i++) {
        const carte = document.createElement('li');
        let couleur = types[tab[i].type];
        carte.style.background = couleur;
        let name_carte= document.createElement('h5');
        name_carte.innerText = tab[i].name;
        let id_carte = document.createElement('p');
        id_carte.innerText = `ID# ${tab[i].id}`;
        let image_carte = document.createElement('img');
        image_carte.src = tab[i].pic;

        carte.appendChild(name_carte);
        carte.appendChild(id_carte);
        carte.appendChild(image_carte);

        liste_poke.appendChild(carte);
    }
}

// Conception du scroll infini

window.addEventListener("scroll", () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    // console.log(scrollTop, scrollHeight, clientHeight);

    if(scrollTop + clientHeight >= scrollHeight - 20) {
        addPoke(6);
    }
})

let index = 21;

function addPoke(nbr) {
    if(index > 200) {
        return;
    }
    const tab_ajout = all_pokemon_fr.slice(index, index + nbr);
    console.log(index, index + nbr);
    createCard(tab_ajout);
    index += nbr;
}

// Fonction permettant d'effectuer la recherche d'un pokemon

// Effectuer la recherche grace au bouton 'Recherche'
// search_form = document.querySelector('form')

// search_form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     recherche();
// })

search_input.addEventListener('keyup', recherche);

function recherche() {
    if(index < 200) {
        addPoke(179);
    }

    let all_li, all_titles, title_value, filter;
    filter = search_input.value.toUpperCase();
    all_li = document.querySelectorAll('li');
    all_titles = document.querySelectorAll('li > h5');

    for(let i=0;i<all_li.length;i++) {
        title_value = all_li[i].innerText;

        if(title_value.toUpperCase().indexOf(filter) > -1) {
            all_li[i].style.display = 'flex';
        }
        else{
            all_li[i].style.display = 'none';
        }
    }
}

// Animation de la balise input et de la balise label

search_input.addEventListener('input', (e) => {

    if(e.target.value !== "") {
        e.target.parentNode.classList.add("active_input");
    } 
    else if(e.target.value === "") {
        e.target.parentNode.classList.remove("active_input");
    }

})