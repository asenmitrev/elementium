import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Wind, Droplets, Mountain, Flame } from "lucide-react";
import { Hero, UnitTypeUserFacing } from "../../types";
import Image from "next/image";
import Link from "next/link";
export default function HeroCard({
  hero,
  link,
  showArmy = true,
}: {
  hero: Hero;
  link?: string;
  showArmy?: boolean;
}) {
  return (
    <Card className="w-full max-w-md overflow-hidden flex flex-col">
      <div className="relative group">
        {/* Image container with all content */}
        <Link href={link ?? `/hero/${hero._id}`}>
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
                      hero.alive
                        ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                        : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                    }`}
                  >
                    {hero.alive ? "Active" : "Dead"}
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
        </Link>
      </div>

      {/* Soldiers List */}
      {!showArmy ? null : hero.units.length > 0 ? (
        <div className="grid grid-cols-3 gap-0">
          {hero.units.slice(0, 3).map((unit, index) => (
            <SoldierItem
              key={index}
              unit={unit}
              moreUnitsCount={index === 2 ? hero.units.length - 3 : 0}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center flex-grow text-xs text-gray-500 py-4 px-4">
          This hero does not have an army.
        </div>
      )}
    </Card>
  );
}

function SoldierItem({
  unit,
  moreUnitsCount = 0,
}: {
  unit: UnitTypeUserFacing;
  moreUnitsCount?: number;
}) {
  return (
    <button className="group relative flex flex-col items-center">
      <div className="relative w-full aspect-square">
        <Image src={unit.image} alt={unit.name} fill className="object-cover" />
        {moreUnitsCount > 0 && (
          <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/50 text-gray-50 text-sm flex items-center justify-center">
            +{moreUnitsCount}
          </div>
        )}
        <div className="flex absolute bottom-1 left-1 items-center gap-1 text-xs text-white/60 group-hover:text-white/90 transition-colors">
          <span>{unit.name}</span>
        </div>
      </div>
    </button>
  );
}
