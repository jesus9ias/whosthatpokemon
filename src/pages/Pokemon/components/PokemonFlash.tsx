import { computed } from '@preact/signals';
import { Pokemon } from '../interfaces/Pokemon';

export default function PokemonFlash({
  countTurns,
  endedTurn,
  pokemonsData,
  correctOption,
  selectedCorrectOption
}) {
  const hiddenImageStyle = computed(() => countTurns.value === 0 || endedTurn.value ? '' : '-webkit-filter: brightness(0%);');

  const correctName = computed(() => pokemonsData.value.find((pokemon: Pokemon) => pokemon.id === correctOption.value).name);

  const pokemonImageUrl = computed(() => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${correctOption.value}.png`);

  return (
    <>
      <div class="pokemon__flash">
        <div
          class="pokemon__image m-auto"
          style={`background-image: url("${pokemonImageUrl.value}");${hiddenImageStyle.value}`}
        >
        </div>
        {
          selectedCorrectOption.value ? <span class="material-symbols-outlined response-icon response-icon--success">done</span> : null
        }
        {
          !selectedCorrectOption.value && endedTurn.value ? <span class="material-symbols-outlined response-icon response-icon--error">close</span> : null
        }
      </div>

      {
        endedTurn.value ? <h2 class="text-4xl poke-font">{correctName.value}</h2> : null
      }
    </>
  );
}