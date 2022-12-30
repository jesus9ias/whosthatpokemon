import { Pokemon } from '../interfaces/Pokemon';

const pokemonOptionClass = (id: number, endedTurn: boolean, selectedOption: number, correctOption: number) => {
  let className = 'button button--gray';
  if (endedTurn && id !== selectedOption) {
    className += ' button--disabled';
  }
  if (endedTurn && id === selectedOption && id === correctOption) {
    className += ' button--success';
  }
  if (endedTurn && id === selectedOption && id !== correctOption) {
    className += ' button--error';
  }
  return className;
};

export default function PokemonOptions({
  pokemonsData,
  isLoadingOptions,
  endedTurn,
  selectedOption,
  correctOption,
  review
}) {
  return (
    <>
      {
        isLoadingOptions.value ?
          <div class="py-4 flex justify-center">
            <div class="button button--gray button--skeleton"></div>
            <div class="button button--gray button--skeleton"></div>
            <div class="button button--gray button--skeleton"></div>
            <div class="button button--gray button--skeleton"></div>
          </div>
        :
          <div class="py-4">
            {
              pokemonsData.value.map((pokemon: Pokemon) => (
                <button
                  class={pokemonOptionClass(pokemon.id, endedTurn.value, selectedOption.value, correctOption.value)}
                  disabled={endedTurn.value}
                  onClick={() => review(pokemon.id)}
                >
                  {pokemon.name}
                </button>
              ))
            }
          </div>
      }
    </>
  );
}
