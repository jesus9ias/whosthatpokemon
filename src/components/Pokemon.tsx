import axios from 'axios';
import { signal, computed } from "@preact/signals";
import './pokemon.css';

const pokemonsData = signal([]);
const pokemonImageUrl = signal('');
const correctOption = signal(0);
const revealed = signal(false);
const selectedCorrectOption = signal(false);

const hiddenImageStyle = computed(() => {
  return revealed.value ? '' : '-webkit-filter: brightness(0%);';
});

const getPokemonData = async (id) => {
  const response = await axios({
    method: 'get',
    url: `https://pokeapi.co/api/v2/pokemon/${id}`
  });
  return response;
};

const getAll = async (pokemonOptions) => {
  Promise.all([
    getPokemonData(pokemonOptions[0]),
    getPokemonData(pokemonOptions[1]),
    getPokemonData(pokemonOptions[2]),
    getPokemonData(pokemonOptions[3])
  ]).then((responses) => {
    pokemonsData.value = responses.map((response) => {
      const { id, name } = response.data;
      return { id, name };
    });
  });
}

const reset = () => {
  pokemonsData.value = [];
  pokemonImageUrl.value = '';
  correctOption.value = 0;
  revealed.value = false;
  selectedCorrectOption.value = false;
};

const start = () => {
  reset();
  const pokemonOptions = [];

  while (pokemonOptions.length < 4) {
    const option = Math.floor(Math.random() * 905 + 1);
    if (pokemonOptions.indexOf(option) === -1) {
      pokemonOptions.push(option);
    }
  }

  const random = Math.floor(Math.random() * 4);
  correctOption.value = pokemonOptions[random];

  pokemonImageUrl.value = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${correctOption.value}.png`;

  getAll(pokemonOptions);
}


const review = (id) => {
  if (id === correctOption.value) {
    selectedCorrectOption.value = true;
  }
  revealed.value = true;
}

export default function Pokemon() {
	return (
		<>
    <div class="pokemon">
      <div
        class="pokemon__image"
        style={`background-image: url("${pokemonImageUrl.value}");${hiddenImageStyle.value}`}
      >
      </div>
      {
        pokemonsData.value.map((pokemon) => (
          <button disabled={revealed.value} onClick={() => review(pokemon.id)}>{pokemon.name}</button>
        ))
      }
      <button onClick={() => start()}>Start</button>
      {
        selectedCorrectOption.value ? <h2>Correct!!!</h2> : null
      }
    </div>
		</>
	);
}