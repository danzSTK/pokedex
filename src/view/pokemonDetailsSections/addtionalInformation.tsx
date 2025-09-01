import { TypeBadge } from "@/components/badge";
import CardTitle from "@/components/titles/cardtitle";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TYPE_COLORS } from "@/models/constants";

const AdditionalInformation = () => {
  return (
    <article className="space-y-6">
      <CardTitle style={{ color: TYPE_COLORS["fire"] }}>
        Additional Information
      </CardTitle>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold" as={"h5"}>
              Type Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <section className="space-y-4">
              <article className="space-y-2">
                <CardTitle className="text-base text-destructive">
                  Weak to (takes 2x damage):
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <TypeBadge type="water" />
                  <TypeBadge type="rock" />
                  <TypeBadge type="electric" />
                </div>
              </article>

              <article className="space-y-2">
                <CardTitle className="text-base text-chart-2">
                  Resistant to (takes 0.5x damage):
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <TypeBadge type="fire" />
                  <TypeBadge type="grass" />
                  <TypeBadge type="fighting" />
                  <TypeBadge type="bug" />
                  <TypeBadge type="fairy" />
                  <TypeBadge type="steel" />
                </div>
              </article>

              <article className="space-y-2">
                <CardTitle className="text-base text-muted-foreground">
                  No effect (takes 0x damage):
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <TypeBadge type="ground" />
                </div>
              </article>
            </section>
          </CardContent>
        </Card>
      </div>
    </article>
  );
};

export default AdditionalInformation;
