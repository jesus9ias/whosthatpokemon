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

export default function PokemonOptions(props) {
  return (
    <div class="py-4">
      {
        props.pokemonsData.value.map((pokemon: Pokemon) => (
          <button
            class={pokemonOptionClass(pokemon.id, props.endedTurn.value, props.selectedOption.value, props.correctOption.value)}
            disabled={props.endedTurn.value}
            onClick={() => props.review(pokemon.id)}
          >
            {pokemon.name}
          </button>
        ))
      }
    </div>
  );
}
