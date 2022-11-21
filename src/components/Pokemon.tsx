import axios from 'axios';
import { signal, computed } from "@preact/signals";

const pokemonsData = signal([]);
const pokemonImageUrl = signal('');
const correctOption = signal(0);
const revealed = signal(false);
const selectedCorrectOption = signal(false);
const endedTurn = signal(false);
const countTurns = signal(1);
const countSuccess = signal(1);

const hiddenImageStyle = computed(() => revealed.value ? '' : '-webkit-filter: brightness(0%);');

const correctName = computed(() => pokemonsData.value.find((pokemon) => pokemon.id === correctOption.value).name);

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

const getOptions = () => {
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

  return pokemonOptions;
}

const reset = () => {
  pokemonsData.value = [];
  pokemonImageUrl.value = '';
  correctOption.value = 0;
  revealed.value = false;
  selectedCorrectOption.value = false;
  endedTurn.value = false;
};

const start = () => {
  reset();
  countTurns.value = 1;
  countSuccess.value = 1;
  getAll(getOptions());
}

const next = () => {
  reset();
  countTurns.value++;
  getAll(getOptions());
}


const review = (id) => {
  if (id === correctOption.value) {
    selectedCorrectOption.value = true;
    countSuccess.value++;
  }
  revealed.value = true;
  endedTurn.value = true;
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
      <p>{countSuccess.value}/{countTurns.value}</p>
      {
        pokemonsData.value.map((pokemon) => (
          <button disabled={endedTurn.value} onClick={() => review(pokemon.id)}>{pokemon.name}</button>
        ))
      }
      <button onClick={() => start()}>Start</button>
      <button onClick={() => next()}>Next</button>
      {
        endedTurn.value ? <h2>{correctName.value}</h2> : null
      }
      {
        selectedCorrectOption.value ? <h2>Correct!!!</h2> : null
      }
      {
        !selectedCorrectOption.value && endedTurn.value ? <h2>failed :(</h2> : null
      }
    </div>
		</>
	);
}