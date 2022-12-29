import axios from 'axios';
import { signal, computed } from '@preact/signals';

const pokemonsData = signal([]);
const correctOption = signal(0);
const selectedOption = signal(0);
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

const pokemonOptionClass = (id: number) => {
  let className = 'button button--gray';
  if (endedTurn.value && id !== selectedOption.value) {
    className += ' button--disabled';
  }
  if (endedTurn.value && id === selectedOption.value && id === correctOption.value) {
    className += ' button--success';
  }
  if (endedTurn.value && id === selectedOption.value && id !== correctOption.value) {
    className += ' button--error';
  }
  return className;
};

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
  pokemonsData.value = [];
  correctOption.value = 0;
  selectedOption.value = 0;
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
  if (endedTurn.value) {
    reset();
    countTurns.value++;
    getAll(getOptions());
  }
}


const review = (id: number) => {
  selectedOption.value = id;
  if (id === correctOption.value) {
    selectedCorrectOption.value = true;
    countSuccess.value++;
  }
  endedTurn.value = true;
}

start();

export default function Pokemon() {
	return (
		<>
    <div class="pokemon text-center">
      <div class="pokemon__flash">
        <div
          class="pokemon__image m-auto"
          style={`background-image: url("${pokemonImageUrl.value}");${hiddenImageStyle.value}`}
        >
        </div>
      </div>
      
      {
        endedTurn.value ? <h2 class="text-4xl poke-font">{correctName.value}</h2> : null
      }
      <div class="py-4">
        {
          pokemonsData.value.map((pokemon) => (
            <button class={pokemonOptionClass(pokemon.id)} disabled={endedTurn.value} onClick={() => review(pokemon.id)}>{pokemon.name}</button>
          ))
        }
      </div>
      {
        selectedCorrectOption.value ? <h2>Correct!!!</h2> : null
      }
      {
        !selectedCorrectOption.value && endedTurn.value ? <h2>failed :(</h2> : null
      }
      <div class="flex text-white">
        <p class="my-1 mx-2 text-lg text-left">{countSuccess.value}/{countTurns.value}</p>
        <span
          class="material-symbols-outlined flex-1 text-left mx-2 cursor-pointer leading-[unset]"
          title="Restart"
          onClick={() => start()}
        >
          restart_alt
        </span>
        <span
          class={`material-symbols-outlined mx-2 cursor-pointer leading-[unset] ${!endedTurn.value ? 'opacity-40' : ''}`}
          title="Next"
          onClick={() => next()}
        >
          arrow_forward
        </span>
      </div>
    </div>
		</>
	);
}