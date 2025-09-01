import { POKEMON_API_BASE_URL } from "@/models/constants";
import { Pokemon } from "@/models/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    const res = await fetch(`${POKEMON_API_BASE_URL}/pokemon/${name}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }

    const data: Pokemon = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
