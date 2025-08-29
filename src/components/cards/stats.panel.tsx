import { MAX_STATS, StatsType, TYPE_COLORS } from "@/models/constants";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import ProgressBar from "../progressBar";

export interface StatsPanelProps {
  pokemon: { stats: { base_stat: number; stat: { name: StatsType } }[] };
}

const StatsPanel = ({ pokemon }: StatsPanelProps) => {
  const totalStats = pokemon.stats.reduce(
    (acc, stat) => acc + stat.base_stat,
    0
  );

  console.log(TYPE_COLORS["fire"]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pokemon.stats.map((stat) => {
          const statName = stat.stat.name;
          const maxStat = MAX_STATS[stat.stat.name] || 255;
          const percentage = (stat.base_stat / maxStat) * 100;

          return (
            <div key={stat.stat.name} className="space-y-2">
              <div
                className={cn("flex justify-between items-center text-base")}
                style={{ color: TYPE_COLORS["fire"] }}
              >
                <span className="text-sm font-medium capitalize">
                  {statName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.base_stat} ({Math.round(percentage)}%)
                </span>
              </div>
              <ProgressBar
                value={percentage}
                className="h-2"
                barColor={TYPE_COLORS["fire"]}
              />
            </div>
          );
        })}

        {/* Stats Bars */}
      </div>
      <div className="pt-2 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total</span>
          <span className="text-sm font-bold">{totalStats}</span>
        </div>
      </div>
    </>
  );
};

export default StatsPanel;
