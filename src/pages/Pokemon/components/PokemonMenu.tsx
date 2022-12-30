
export default function PokemonMenu({ countSuccess, countTurns, endedTurn, start, next }) {
  return (
    <div class="flex flex-1 items-end text-white">
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
  );
}
