"use client";

// React e Next.js
import { useState } from "react";

// Outras bibliotecas
import { GitCompare } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PokemonCardCompare } from "./cards/pokemonCard";
import CardTitle from "./titles/cardtitle";

// Hooks e contexts
import { useCompare } from "@/contexts/CompareContext";

export function CompareDrawer() {
  const { comparePokemons, removeFromCompare, clearCompare } = useCompare();
  const [isOpen, setIsOpen] = useState(false);

  if (comparePokemons.length === 0) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-[70px] right-4 z-50 shadow-lg"
          variant="default"
          size="lg"
        >
          <GitCompare className="h-5 w-5" />
          <span className="ml-2">Comparar ({comparePokemons.length})</span>
        </Button>
      </SheetTrigger>
      <SheetContent className=" w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="">
            <CardTitle as={"span"}>Pokémons para Comparar</CardTitle>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            Limpar Todos
          </Button>
          {/* Lista de Pokémons */}
          {comparePokemons.map((pokemon) => (
            <PokemonCardCompare
              key={pokemon.id}
              pokemon={pokemon}
              removeFromCompare={removeFromCompare}
            />
          ))}

          {comparePokemons.length < 3 && (
            <div className="text-center p-4 text-sm text-muted-foreground">
              <p>
                Você pode adicionar até {3 - comparePokemons.length} Pokémons a
                mais
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
