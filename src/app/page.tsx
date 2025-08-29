"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Pokedex</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">
            Bem-vindo à Pokédex
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma Pokédex moderna e interativa para explorar o mundo Pokémon.
            Descubra informações detalhadas sobre Pokémon, suas habilidades,
            estatísticas e muito mais.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mt-12">
            <Card>
              <CardHeader>
                <CardTitle>🔍 Explorar Pokémon</CardTitle>
                <CardDescription>
                  Pesquise e descubra todos os Pokémon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Em Breve</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Tipos e Habilidades</CardTitle>
                <CardDescription>
                  Conheça os tipos e habilidades únicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Em Breve
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Estatísticas</CardTitle>
                <CardDescription>
                  Compare estatísticas e evolução
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Em Breve
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
