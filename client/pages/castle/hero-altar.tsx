import { mockHeroes } from "@/mocks/heroes";
import HeroList from "@/components/hero-list";
import CastleLayout from "./layout";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import BuildingHeader from "@/components/building-header";

export default function HeroGuild() {
  return (
    <CastleLayout>
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <BuildingHeader
              imageUrl="/images/altar-fire.jpg"
              title="Hero Altar"
            />

            <div className="space-y-6 w-full">
              {/* Castle Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Upgrade Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={33} className="w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <h2 className="text-xl text-white">
          These heroes have died, you can revive them
        </h2>

        <HeroList heroes={mockHeroes.filter((hero) => !hero.alive)} />
      </div>
    </CastleLayout>
  );
}
