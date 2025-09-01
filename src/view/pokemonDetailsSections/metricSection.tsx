import StatsPanel, { StatsPanelProps } from "@/components/cards/stats.panel";
import CardTitle from "@/components/titles/cardtitle";
import { TYPE_COLORS } from "@/models/constants";

const MetricSection = ({ pokemon, type }: StatsPanelProps) => {
  return (
    <article className="space-y-6">
      <CardTitle style={{ color: TYPE_COLORS[type] }}>Base Stats</CardTitle>
      <StatsPanel pokemon={pokemon} type={type} />
    </article>
  );
};

export default MetricSection;
