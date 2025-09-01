"use client";

// React e Next.js
import React from "react";

// Outras bibliotecas
import { Filter, X } from "lucide-react";

// Components
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CardTitle from "./titles/cardtitle";

// Contexts e hooks
import { useFilter } from "@/contexts/FilterContext";

// Types e constantes
import { POKEMON_TYPES, TYPE_COLORS } from "@/models/constants";

interface FilterSheetProps {
  isNavButton?: boolean;
}

const pokemonTypes = Object.values(POKEMON_TYPES);

export const FilterSheet: React.FC<FilterSheetProps> = ({
  isNavButton = false,
}) => {
  const { selectedTypes, toggleType, clearFilters, isFilterActive } =
    useFilter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {isNavButton ? (
          <Button
            variant={isFilterActive ? "default" : "ghost"}
            size={"lg"}
            className="relative grid grid-col-1 place-items-center gap-0"
          >
            <Filter />
            <span className="text-xs">Filters</span>
            {isFilterActive && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
        ) : (
          <Button variant={isFilterActive ? "default" : "outline"}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {isFilterActive && (
              <Badge variant="secondary" className="ml-2">
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filtrar por Tipos</SheetTitle>
          <SheetDescription>
            Selecione os tipos de Pokémon que deseja visualizar
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Filtros ativos */}
          {isFilterActive && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle as={"h3"}>
                  Filtros Ativos ({selectedTypes.length})
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 px-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="cursor-pointer px-5 py-2"
                    style={{
                      backgroundColor: TYPE_COLORS[type],
                      color: "white",
                      border: "none",
                    }}
                    onClick={() => toggleType(type)}
                  >
                    {type}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Todos os tipos */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Tipos Disponíveis</h3>
            <div className="grid grid-cols-3 gap-3">
              {pokemonTypes.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <Button
                    key={type}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleType(type)}
                    className="justify-center capitalize"
                    style={
                      isSelected
                        ? {
                            backgroundColor: TYPE_COLORS[type],
                            borderColor: TYPE_COLORS[type],
                            color: "white",
                          }
                        : {}
                    }
                  >
                    {type}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="border-t pt-4 space-y-2">
            <div className="text-sm text-muted-foreground">
              {isFilterActive ? (
                <>
                  Filtrando por {selectedTypes.length} tipo
                  {selectedTypes.length > 1 ? "s" : ""}
                </>
              ) : (
                "Nenhum filtro ativo - mostrando todos os Pokémons"
              )}
            </div>
            {isFilterActive && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                💡 Os resultados são salvos em cache para uma experiência mais
                rápida
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
