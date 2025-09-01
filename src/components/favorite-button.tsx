import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
}

export const FavoriteButton = ({
  isFavorite,
  onToggle,
  className,
}: FavoriteButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute top-2 right-2 z-30 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200",
        "shadow-md hover:shadow-lg",
        "focus:outline-none focus-visible:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        "active:scale-95",
        className
      )}
      onClick={(e) => {
        e.preventDefault(); // Previne navegação se estiver dentro de um link
        e.stopPropagation(); // Para propagação do evento
        onToggle();
      }}
      aria-label={
        isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
      }
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isFavorite
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-500 hover:text-red-500 hover:scale-105"
        )}
      />
    </Button>
  );
};
