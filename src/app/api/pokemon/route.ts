import { POKEMON_API_BASE_URL } from "@/models/constants";
import { PokemonListResponse } from "@/models/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20);
  const offset = Number(request.nextUrl.searchParams.get("offset") ?? 0);

  const res = await fetch(
    `${POKEMON_API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    {
      next: { revalidate: 3600 }, // Cache por 1 hora
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      {
        error: "Failed to fetch Pokémon data",
        status: res.status,
      },
      { status: res.status }
    );
  }

  const data: PokemonListResponse = await res.json();

  return NextResponse.json(data);
}
