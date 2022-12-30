import { signal } from '@preact/signals';
import { getPokemonData } from './api/getPokemonData';
import PokemonFlash from './components/PokemonFlash';
import PokemonOptions from './components/PokemonOptions';
import PokemonMenu from './components/PokemonMenu';
import { Pokemon } from './interfaces/Pokemon';

const pokemonsData = signal([]);
const correctOption = signal(0);
const selectedOption = signal(0);
const selectedCorrectOption = signal(false);
const gameStarted = signal(false);
const endedTurn = signal(false);
const countTurns = signal(0);
const countSuccess = signal(0);
const isLoadingOptions = signal(false);

const maxPokemons = 905;
const maxOptions = 4;

const getAll = async (pokemonOptions: number[]) => {
  isLoadingOptions.value = true;
  Promise.all([
    getPokemonData(pokemonOptions[0]),
    getPokemonData(pokemonOptions[1]),
    getPokemonData(pokemonOptions[2]),
    getPokemonData(pokemonOptions[3])
  ]).then((responses) => {
    pokemonsData.value = responses.map((response) => {
      const { id, name }: Pokemon = response.data;
      return { id, name };
    });
    isLoadingOptions.value = false;
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
    <div class="pokemon text-center">
      <PokemonFlash
        endedTurn={endedTurn}
        countTurns={countTurns}
        pokemonsData={pokemonsData}
        correctOption={correctOption}
        selectedCorrectOption={selectedCorrectOption}
      />
      <PokemonOptions
        endedTurn={endedTurn}
        selectedOption={selectedOption}
        pokemonsData={pokemonsData}
        correctOption={correctOption}
        isLoadingOptions={isLoadingOptions}
        review={review}
      />
      <PokemonMenu
        countSuccess={countSuccess}
        countTurns={countTurns}
        endedTurn={endedTurn}
        start={start}
        next={next}
      />
    </div>
	);
}