import { PokemonPromptProps } from "@/app/api/pokemon/description/route";
import { GeminiAiApiService } from "@/services/gemini/geminiAi-api";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./imageWithFallback";
import { TypeBadge } from "./badge";
import { TYPE_COLORS } from "@/models/constants";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface PokemonModalProps extends PokemonPromptProps {
  id: number;
  image: string;
}

interface PokemonDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemon: PokemonModalProps;
}

const PokemonDescriptionModal: React.FC<PokemonDescriptionModalProps> = ({
  isOpen,
  onClose,
  pokemon,
}) => {
  const [aiDescription, setAiDescription] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = React.useState<boolean>(false);

  const generateDescription = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (aiDescription) return;

    setLoading(true);

    try {
      const apiService = new GeminiAiApiService();
      const description = await apiService.getAiDescription(pokemon);
      setAiDescription(description);

      setHasGenerated(true);
    } catch (error) {
      console.error(
        "Não foi possível gerar a descrição. Tente novamente",
        error
      );

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAiDescription(null);
    setHasGenerated(false);
    onClose();
  };

  const primaryType = pokemon.types[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <ImageWithFallback
                src={pokemon.image}
                alt={`pokemon-${pokemon.name} image`}
                width={48}
                height={48}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{pokemon.name}</span>
                <span className="text-sm text-muted-foreground font-mono">
                  #{pokemon.id.toString().padStart(3, "0")}
                </span>
              </div>
              <div className="flex gap-1 mt-1">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!hasGenerated && (
            <div className="text-center py-8">
              <div
                className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${TYPE_COLORS[primaryType] || "#68D391"}20`,
                }}
              >
                <Sparkles
                  className="w-12 h-12"
                  style={{ color: TYPE_COLORS[primaryType] || "#68D391" }}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Descobrir mais sobre {pokemon.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                Use nossa IA para gerar uma descrição detalhada com curiosidades
                fascinantes sobre este Pokémon!
              </p>
              <Button
                onClick={generateDescription}
                disabled={loading}
                className="gap-2"
                style={{
                  backgroundColor: TYPE_COLORS[primaryType] || "#68D391",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Descrição com IA
                  </>
                )}
              </Button>
            </div>
          )}

          {aiDescription && (
            <div className="space-y-4">
              <div
                className="p-4 rounded-lg border-l-4"
                style={{
                  borderLeftColor: TYPE_COLORS[primaryType] || "#68D391",
                  backgroundColor: `${TYPE_COLORS[primaryType] || "#68D391"}10`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles
                    className="w-5 h-5"
                    style={{ color: TYPE_COLORS[primaryType] || "#68D391" }}
                  />
                  <span className="font-semibold text-sm">
                    Descrição Gerada por IA
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  {aiDescription.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={generateDescription}
                  disabled={loading}
                  className="gap-2 bg-transparent"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar Nova Descrição
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PokemonDescriptionModal;
