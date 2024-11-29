export const fetchCharacters = async (query: string) => {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${query}`
    );
    const data = await response.json();
    if (data.results) {
      return data.results;
    } else {
      return [];
    }
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
};
