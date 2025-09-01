import StatsPanel, { StatsPanelProps } from "@/components/cards/stats.panel";
import CardTitle from "@/components/titles/cardtitle";
import { TYPE_COLORS } from "@/models/constants";

// TODO: Corrigir props que estão sendo importadas de arquvio externo devido a dados mocados
const MetricSection = ({ pokemon }: StatsPanelProps) => {
  return (
    <article className="space-y-6">
      <CardTitle style={{ color: TYPE_COLORS["fire"] }}>Base Stats</CardTitle>
      <StatsPanel pokemon={pokemon} />
    </article>
  );
};

export default MetricSection;
