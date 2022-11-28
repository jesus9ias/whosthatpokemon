import axios from 'axios';
import { signal, computed } from '@preact/signals';
import './pokemon.css';

const pokemonsData = signal([]);
const correctOption = signal(0);
const selectedCorrectOption = signal(false);
const gameStarted = signal(false);
const endedTurn = signal(false);
const countTurns = signal(0);
const countSuccess = signal(0);

const maxPokemons = 905;
const maxOptions = 4;

const hiddenImageStyle = computed(() => countTurns.value === 0 || endedTurn.value ? '' : '-webkit-filter: brightness(0%);');

const correctName = computed(() => pokemonsData.value.find((pokemon) => pokemon.id === correctOption.value).name);

const pokemonImageUrl = computed(() => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${correctOption.value}.png`);

const startText = computed(() => gameStarted.value ? 'RESTART' : 'START');

const getPokemonData = async (id: number) => {
  const response = await axios({
    method: 'get',
    url: `https://pokeapi.co/api/v2/pokemon/${id}`
  });
  return response;
};

const getAll = async (pokemonOptions: number[]) => {
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

  while (pokemonOptions.length < maxOptions) {
    const option = Math.floor(Math.random() * maxPokemons + 1);
    if (pokemonOptions.indexOf(option) === -1) {
      pokemonOptions.push(option);
    }
  }

  const random = Math.floor(Math.random() * maxOptions);
  correctOption.value = pokemonOptions[random];

  return pokemonOptions;
}

const reset = () => {
  gameStarted.value = false;
  pokemonsData.value = [];
  correctOption.value = 0;
  selectedCorrectOption.value = false;
  endedTurn.value = false;
};

const start = () => {
  reset();
  gameStarted.value = true;
  countTurns.value = 1;
  countSuccess.value = 0;
  getAll(getOptions());
}

const next = () => {
  reset();
  countTurns.value++;
  getAll(getOptions());
}


const review = (id: number) => {
  if (id === correctOption.value) {
    selectedCorrectOption.value = true;
    countSuccess.value++;
  }
  endedTurn.value = true;
}

export default function Pokemon() {
	return (
		<>
    <div class="pokemon text-center">
      <div
        class="pokemon__image m-auto"
        style={`background-image: url("${pokemonImageUrl.value}");${hiddenImageStyle.value}`}
      >
      </div>
      <p>{countSuccess.value}/{countTurns.value}</p>
      {
        pokemonsData.value.map((pokemon) => (
          <button class="button button-gray" disabled={endedTurn.value} onClick={() => review(pokemon.id)}>{pokemon.name}</button>
        ))
      }
      <div>
        {
          endedTurn.value ? <button class="button button-dark" onClick={() => next()}>NEXT</button> : null
        }
      </div>
      <div>
        <button class="button button-dark" onClick={() => start()}>{startText}</button>
      </div>
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