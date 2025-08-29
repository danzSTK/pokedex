"use client";

import { TYPE_COLORS } from "@/models/constants";
import { InformationBadge, TypeBadge } from "@/components/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import CardTitle from "@/components/titles/cardtitle";
import { useCallback } from "react";
import { House, Weight } from "lucide-react";
import StatsPanel, { StatsPanelProps } from "@/components/cards/stats.panel";

const pokemonMock: StatsPanelProps = {
  pokemon: {
    stats: [
      { base_stat: 50, stat: { name: "hp" } },
      { base_stat: 60, stat: { name: "attack" } },
      { base_stat: 70, stat: { name: "defense" } },
      { base_stat: 80, stat: { name: "special-attack" } },
      { base_stat: 90, stat: { name: "special-defense" } },
      { base_stat: 100, stat: { name: "speed" } },
    ],
  },
};

const PokemonPage = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();

  return (
    <div className="min-h-screen bg-card">
      <header className="fixed left-0 right-0 border-bbg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">
            Nome Pokemon{" "}
            <span className="text-muted-foreground text-base font-mono">
              #00{pokemonId}
            </span>
          </h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="" style={{ backgroundColor: TYPE_COLORS["fire"] }}>
        <section className="w-full py-8">
          <div className="container mx-auto px-4 z-10">
            <article className="mb-2 mt-12">
              <nav>
                <Link href="/">
                  <Button variant="outline">← Voltar para Home</Button>
                </Link>
              </nav>
            </article>

            <article className="flex flex-col items-center justify-center">
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png`}
                alt={`Pokemon ${pokemonId}`}
                width={300}
                height={300}
              />
              <div className="flex space-x-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <TypeBadge key={index} type="fire" />
                ))}
              </div>
            </article>
          </div>
        </section>
        <section className="bg-card rounded-t-4xl py-24 -mt-28">
          <div className="container mx-auto px-4 space-y-6">
            <article className="space-y-4">
              <CardTitle style={{ color: TYPE_COLORS["fire"] }}>
                About Pokémon
              </CardTitle>

              <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                <InformationBadge icon={Weight} title="Weight" label="60 kg" />
                <div className="w-px h-12 bg-muted-foreground/30 hidden sm:block"></div>
                <InformationBadge icon={Weight} title="Height" label="1.8 m" />
                <div className="w-px h-12 bg-muted-foreground/30 hidden sm:block"></div>
                <InformationBadge
                  icon={House}
                  title="Habitat"
                  label="Mountain"
                />
              </div>

              <p className="text-muted-foreground px-2">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam
                quo, necessitatibus veritatis consequuntur, consectetur maxime
                obcaecati tempore distinctio quia officia quisquam suscipit
                eligendi! Mollitia ullam perferendis esse laborum perspiciatis
                distinctio.
              </p>
            </article>

            <article className="space-y-6">
              <CardTitle style={{ color: TYPE_COLORS["fire"] }}>
                Base Stats
              </CardTitle>
              <StatsPanel pokemon={pokemonMock.pokemon} />
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PokemonPage;
