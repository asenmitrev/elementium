import { Card } from "@/components/ui/card";
import { Droplets, Mountain, Flame } from "lucide-react";
import { UnitType, UnitTypeSimple } from "types";
import Image from "next/image";
export default function SoldierCard({
  unit,
}: {
  unit: UnitType | UnitTypeSimple;
}) {
  return (
    <Card className="w-full max-w-md overflow-hidden">
      <div className="relative group">
        <div className="relative aspect-[4/3]">
          <Image
            src={`/images/units/${unit.image}`}
            alt={unit.name}
            fill
            className="object-cover w-full h-full"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90">
            <div className="absolute top-0 left-0 right-0 p-4">
              <h2 className="text-2xl font-bold text-white">{unit.name}</h2>
              <div className="text-md text-white font-medium">
                Level: {unit.level}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
              <div className="text-sm text-white text-shadow-lg">
                {unit.effect?.explanation}
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-white">
                  <Mountain className="w-4 h-4 text-green-300" />
                  <span className="font-medium">{unit.earth}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="font-medium">{unit.fire}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Droplets className="w-4 h-4 text-blue-300" />
                  <span className="font-medium">{unit.water}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
