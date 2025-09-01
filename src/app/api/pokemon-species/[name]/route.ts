import { POKEMON_API_BASE_URL } from "@/models/constants";
import { PokemonSpecies } from "@/models/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    const res = await fetch(`${POKEMON_API_BASE_URL}/pokemon-species/${name}`, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Pokemon species not found" },
        { status: 404 }
      );
    }

    const data: PokemonSpecies = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Pokémon species data:", error);
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
