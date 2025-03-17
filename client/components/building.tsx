import { Card } from "@/components/ui/card";
import { Building } from "types";
import { Building as BuildingIcon } from "lucide-react";
import Link from "next/link";
import { BUILDING_CONFIGS } from "@/config/buildings";
export const getBuildingImage = (building: Building, type: string) => {
  switch (building.type) {
    case "walls":
      return `/images/wall-${type}.jpg`;
    case "magicShield":
      return `/images/shield-${type}.jpg`;
    case "moat":
      return `/images/moat-${type}.jpg`;
    case "towers":
      return `/images/tower-${type}.jpg`;
    case "altar":
      return `/images/altar-${type}.jpg`;
    case "spyGuild":
      return `/images/spy-${type}.jpg`;
    case "mine":
      return `/images/mine-${type}.jpg`;
    case "counterEspionageGuild":
      return `/images/counterspy-${type}.jpg`;
    case "heroGuild":
      return `/images/hero-guild-${type}.jpg`;
    default:
      return `/images/wall-${type}.jpg`;
  }
};
export default function BuildingCard({
  building,
  castleId,
  type,
}: {
  building: Building;
  castleId: string;
  type: "fire" | "water" | "earth";
}) {
  const buildingConfig = BUILDING_CONFIGS[building.type];
  const cardContent = (
    <div className="relative aspect-video">
      <img
        src={getBuildingImage(building, type)}
        alt={`${buildingConfig.name} image`}
        className="object-cover w-full h-full"
      />

      {/* Dark gradient overlay that's always visible at the top and bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90">
        {/* Top content */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <h2 className="text-xl font-bold text-white">
            {buildingConfig.name}
          </h2>
          <p className="text-2xs text-zinc-300">Level {building.level}</p>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white shadow-md">
                {buildingConfig.description}
              </p>
            </div>
            <div className="flex text-xs items-center gap-2 text-zinc-300">
              <BuildingIcon className="w-4 h-4 text-white-500" />
              Level {building.level}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Card className="w-full max-w-md overflow-hidden">
      <div className="relative group">
        {/* Image container with all content */}
        {buildingConfig.link ? (
          <Link
            href={`/castle/${castleId}/${buildingConfig.link}`}
            className="block"
          >
            {cardContent}
          </Link>
        ) : (
          <>{cardContent}</>
        )}
      </div>
    </Card>
  );
}
