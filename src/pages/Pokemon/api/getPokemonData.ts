import axios from 'axios';

export const getPokemonData = async (id: number) => {
  const response = await axios({
    method: 'get',
    url: `https://pokeapi.co/api/v2/pokemon/${id}`
  });
  return response;
};
