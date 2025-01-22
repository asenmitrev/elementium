import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Wind, Droplets, Mountain, Flame } from "lucide-react";
import { Hero } from "@/types";

export default function HeroCard({ hero }: { hero: Hero }) {
  return (
    <Card className="w-full max-w-md overflow-hidden">
      <div className="relative group">
        {/* Image container with all content */}
        <div className="relative aspect-[4/3]">
          <img
            src={hero.type.image}
            alt="Hero"
            className="object-cover w-full h-full"
          />

          {/* Dark gradient overlay that's always visible at the top and bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90">
            {/* Top content */}
            <div className="absolute top-0 left-0 right-0 p-4">
              <h2 className="text-2xl font-bold text-white flex items-center justify-between">
                {hero.type.name}
                <Badge
                  className={`${
                    hero.isAlive
                      ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  }`}
                >
                  {hero.isAlive ? "Active" : "Dead"}
                </Badge>
              </h2>
              {/* Level and status */}
              <div className="text-sm text-white font-medium">
                Level: {hero.level}
              </div>
            </div>
            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-white">
                  <Wind className="w-4 h-4 text-gray-300" />
                  <span className="font-medium ">{hero.type.wind}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Droplets className="w-4 h-4 text-blue-300" />
                  <span className="font-medium">{hero.type.water}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Mountain className="w-4 h-4 text-green-300" />
                  <span className="font-medium">{hero.type.earth}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="font-medium">{hero.type.fire}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
