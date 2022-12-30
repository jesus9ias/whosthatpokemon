import { computed } from '@preact/signals';

export default function PokemonFlash(props) {
  const hiddenImageStyle = computed(() => props.countTurns.value === 0 || props.endedTurn.value ? '' : '-webkit-filter: brightness(0%);');

  const correctName = computed(() => props.pokemonsData.value.find((pokemon) => pokemon.id === props.correctOption.value).name);

  const pokemonImageUrl = computed(() => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.correctOption.value}.png`);

  return (
    <>
      <div class="pokemon__flash">
        <div
          class="pokemon__image m-auto"
          style={`background-image: url("${pokemonImageUrl.value}");${hiddenImageStyle.value}`}
        >
        </div>
        {
          props.selectedCorrectOption.value ? <span class="material-symbols-outlined response-icon response-icon--success">done</span> : null
        }
        {
          !props.selectedCorrectOption.value && props.endedTurn.value ? <span class="material-symbols-outlined response-icon response-icon--error">close</span> : null
        }
      </div>

      {
        props.endedTurn.value ? <h2 class="text-4xl poke-font">{correctName.value}</h2> : null
      }
    </>
  );
}