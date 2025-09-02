import { PokemonPromptProps } from "@/app/api/pokemon/description/route";

export class GeminiAiApiService {
  public async getAiDescription(
    pokemonData: PokemonPromptProps
  ): Promise<string> {
    try {
      const response = await fetch("/api/pokemon/description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pokemonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao gerar descrição");
      }

      const data = await response.json();
      return data.description;
    } catch (error) {
      console.error("Error ao gerar descrição com IA", error);
      throw error;
    }
  }
}
