import CardTitle from "@/components/titles/cardtitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TYPE_COLORS } from "@/models/constants";
import { Heart } from "lucide-react";

const ActionbarSection = () => {
  return (
    <article>
      <nav className="space-y-4 md:flex justify-between items-center">
        <CardTitle style={{ color: TYPE_COLORS["fire"] }}>
          Pokemon actions:
        </CardTitle>
        <Card>
          <CardContent>
            <ul className="flex gap-2 justify-center flex-wrap">
              <li className="flex-1 flex justify-center">
                <Button variant="outline">
                  <span>Normal</span>
                </Button>
              </li>
              <li className="flex-1 flex justify-center">
                <Button variant="outline">
                  <Heart strokeWidth={2} />
                  <span className="">Favorite</span>
                </Button>
              </li>
              <li className="flex-1 flex justify-center">
                <Button variant="outline">Compare</Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </nav>
    </article>
  );
};

export default ActionbarSection;
