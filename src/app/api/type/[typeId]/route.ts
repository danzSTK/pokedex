import { NextRequest, NextResponse } from "next/server";
import { POKEMON_API_BASE_URL } from "@/models/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ typeId: string }> }
) {
  try {
    const { typeId } = await params;

    if (!typeId) {
      return NextResponse.json(
        { error: "Type ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${POKEMON_API_BASE_URL}/type/${typeId}`, {
      next: { revalidate: 86400 }, // Cache por 24 horas (tipos não mudam)
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Type not found" }, { status: 404 });
      }
      throw new Error(`PokeAPI responded with status: ${response.status}`);
    }

    const typeData = await response.json();
    return NextResponse.json(typeData);
  } catch (error) {
    console.error("Error fetching type data:", error);
    return NextResponse.json(
      { error: "Failed to fetch type data" },
      { status: 500 }
    );
  }
}
