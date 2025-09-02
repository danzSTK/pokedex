import { PokemonType } from "@/models/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export interface PokemonPromptProps {
  name: string;
  types: PokemonType[];
}

function createPrompt(pokemon: PokemonPromptProps) {
  const { name, types } = pokemon;

  return `
      Você é um Professor Pokémon, um especialista como o Professor Carvalho.
    Sua tarefa é criar uma descrição detalhada e cativante para uma Pokédex moderna, baseada nos dados a seguir.

    Pokémon: ${name}
    Tipos: ${types.join(", ")}

    Instruções:
    1.  **Tom de Voz**: Escreva de forma entusiasmada e informativa, como se estivesse apresentando uma nova descoberta a um treinador.
    2.  **Conteúdo**: Descreva o comportamento do Pokémon em seu habitat natural, suas habilidades em batalha, e alguma curiosidade ou fato interessante sobre ele. Seja criativo, mas fiel ao universo Pokémon.
    3.  **Formato**: Retorne a descrição em um único parágrafo, sem usar títulos ou quebras de linha excessivas.
    4.  **Exemplo de inspiração**: "O Charizard é conhecido por seu temperamento orgulhoso e suas chamas que podem derreter rochas. Ele voa pelos céus em busca de oponentes à sua altura, e a intensidade de sua chama aumenta conforme ganha experiência em batalha."

    Agora, crie a descrição para o ${name}.
  `;
}

export async function POST(request: NextRequest) {
  try {
    const pokemonData = await request.json();

    if (!pokemonData || !pokemonData.name) {
      return NextResponse.json(
        { error: "Dados do Pokémon inválidos." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = createPrompt(pokemonData);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const description = response.text();

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Error ao gerar descrição com IA", error);
    return NextResponse.json(
      { error: "Erro ao gerar descrição do Pokémon." },
      { status: 500 }
    );
  }
}
