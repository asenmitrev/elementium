import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building } from "@/types";
import { Building as BuildingIcon } from "lucide-react";
import Link from "next/link";

export default function BuildingCard({ building }: { building: Building }) {
  const getBuildingImage = (building: Building) => {
    switch (building.type) {
      case "walls":
        return "/images/wall-fire.jpg";
      case "magicShield":
        return "/images/shield-fire.jpg";
      case "moat":
        return "/images/moat-fire.jpg";
      case "towers":
        return "/images/tower-fire.jpg";
      case "altar":
        return "/images/altar-fire.jpg";
      case "spyGuild":
        return "/images/spy-fire.jpg";
      case "mine":
        return "/images/mine-fire.jpg";
      case "counterEspionageGuild":
        return "/images/counterspy-fire.jpg";
      case "heroGuild":
        return "/images/hero-guild-fire.jpg";
      default:
        return "/images/wall-fire.jpg";
    }
  };
  const cardContent = (
    <div className="relative aspect-video">
      <img
        src={getBuildingImage(building)}
        alt={`${building.type} image`}
        className="object-cover w-full h-full"
      />

      {/* Dark gradient overlay that's always visible at the top and bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90">
        {/* Top content */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <h2 className="text-xl font-bold text-white">{building.name}</h2>
          <p className="text-2xs text-zinc-300">Level {building.level}</p>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white shadow-md">
                {building.description}
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
        {building.link ? (
          <Link href={`/castle/${building.link}`} className="block">
            {cardContent}
          </Link>
        ) : (
          <>{cardContent}</>
        )}
      </div>
    </Card>
  );
}
