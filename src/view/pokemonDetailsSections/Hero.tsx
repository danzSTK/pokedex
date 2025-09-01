import { TypeBadge } from "@/components/badge";
import { ImageWithFallback } from "@/components/imageWithFallback";
import { Button } from "@/components/ui/button";
import { PokemonType } from "@/models/constants";
import Link from "next/link";

interface HeroSectionProps {
  pokemonName: string;
  pokemonImage: string;
  pokemonTypes?: PokemonType[];
}

const HeroSection = ({
  pokemonName,
  pokemonImage,
  pokemonTypes,
}: HeroSectionProps) => {
  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4 z-10">
        <article className="mb-2">
          <nav>
            <Link href="/">
              <Button variant="outline">← Voltar para Home</Button>
            </Link>
          </nav>
        </article>

        <article className="flex flex-col items-center justify-center">
          <ImageWithFallback
            src={pokemonImage}
            alt={`Pokemon ${pokemonName} image`}
            width={300}
            height={300}
          />
          <div className="flex space-x-2">
            {pokemonTypes?.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default HeroSection;
