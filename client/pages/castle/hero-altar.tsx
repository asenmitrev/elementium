import { mockHeroes } from "@/mocks/heroes";
import HeroList from "@/components/hero-list";
import CastleLayout from "./layout";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function HeroGuild() {
  return (
    <CastleLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Hero Altar</h1>
        <div className="mb-4">
          <a href="/castle" className="text-sm hover:underline">
            ← Back to Castle
          </a>
        </div>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold mb-4">Hero Guild</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative w-full h-64">
              <Image
                src="/images/altar-fire.jpg"
                alt="Castle Banner"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>

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
        <p className="text-gray-600">
          These heroes have died, you can revive them
        </p>

        <HeroList heroes={mockHeroes.filter((hero) => !hero.isAlive)} />
      </div>
    </CastleLayout>
  );
}
