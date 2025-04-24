import { Card } from "@/components/ui/card";
import { Droplets, Mountain, Flame } from "lucide-react";
import { UnitType, UnitTypeSimple } from "types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SoldierCard({
  unit,
  previousUnit,
  showChanges = false,
  battlefieldElement = null,
  compact = false,
}: {
  unit: UnitType | UnitTypeSimple;
  previousUnit?: UnitType | UnitTypeSimple | null;
  showChanges?: boolean;
  battlefieldElement?: string | null;
  compact?: boolean;
}) {
  // Helper function to determine stat change styling and animation
  const getStatDisplay = (
    stat: "earth" | "fire" | "water",
    currentValue: number,
    previousValue?: number
  ) => {
    if (!showChanges || !previousValue) {
      return <span className="font-medium">{currentValue}</span>;
    }

    const hasChanged = currentValue !== previousValue;
    const isIncrease = currentValue > previousValue;
    const difference = isIncrease
      ? `+${currentValue - previousValue}`
      : `${currentValue - previousValue}`;

    return (
      <div className="flex items-center">
        <span
          className={`font-medium ${
            hasChanged ? (isIncrease ? "text-green-400" : "text-red-400") : ""
          }`}
        >
          {currentValue}
        </span>
        <AnimatePresence>
          {hasChanged && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 5 }}
              exit={{ opacity: 0 }}
              className={`ml-1 text-xs font-bold ${
                isIncrease ? "text-green-400" : "text-red-400"
              }`}
            >
              {difference}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const cardContent = (
    <div className="relative group">
      <div
        className={`relative ${compact ? "aspect-[4/2.5]" : "aspect-[4/3]"}`}
      >
        <Image
          src={`/images/units/${unit.image}`}
          alt={unit.name}
          fill
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90">
          <div
            className={`absolute top-0 left-0 right-0 ${
              compact ? "p-2" : "p-4"
            }`}
          >
            <h2
              className={`${
                compact ? "text-lg" : "text-2xl"
              } font-bold text-white`}
            >
              {unit.name}
            </h2>
            <div
              className={`${
                compact ? "text-xs" : "text-md"
              } text-white font-medium`}
            >
              Level: {unit.level}
            </div>
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 ${
              compact ? "p-2 space-y-2" : "p-4 space-y-4"
            }`}
          >
            <div
              className={`${
                compact ? "text-xs" : "text-sm"
              } text-white text-shadow-lg`}
            >
              {unit.effect?.explanation}
            </div>
            <div
              className={`grid grid-cols-3 ${
                compact ? "gap-2 text-xs" : "gap-4 text-sm"
              }`}
            >
              <div
                className={`flex items-center gap-2 text-white ${
                  showChanges &&
                  previousUnit &&
                  unit.earth !== previousUnit.earth
                    ? "animate-pulse"
                    : ""
                } ${
                  battlefieldElement?.toLowerCase().includes("earth")
                    ? "bg-green-900/50 p-1 rounded animate-pulse"
                    : ""
                }`}
              >
                <Mountain
                  className={`${compact ? "w-3 h-3" : "w-4 h-4"} ${
                    battlefieldElement?.toLowerCase().includes("earth")
                      ? "text-green-300 animate-pulse"
                      : "text-green-300"
                  }`}
                />
                {getStatDisplay("earth", unit.earth, previousUnit?.earth)}
              </div>

              <div
                className={`flex items-center gap-2 text-white ${
                  showChanges && previousUnit && unit.fire !== previousUnit.fire
                    ? "animate-pulse"
                    : ""
                } ${
                  battlefieldElement?.toLowerCase().includes("fire")
                    ? "bg-orange-900/50 p-1 rounded animate-pulse"
                    : ""
                }`}
              >
                <Flame
                  className={`${compact ? "w-3 h-3" : "w-4 h-4"} ${
                    battlefieldElement?.toLowerCase().includes("fire")
                      ? "text-orange-300 animate-pulse"
                      : "text-orange-300"
                  }`}
                />
                {getStatDisplay("fire", unit.fire, previousUnit?.fire)}
              </div>

              <div
                className={`flex items-center gap-2 text-white ${
                  showChanges &&
                  previousUnit &&
                  unit.water !== previousUnit.water
                    ? "animate-pulse"
                    : ""
                } ${
                  battlefieldElement?.toLowerCase().includes("water") &&
                  unit.water > unit.earth &&
                  unit.water > unit.fire
                    ? "bg-blue-900/50 p-1 rounded animate-pulse"
                    : ""
                }`}
              >
                <Droplets
                  className={`${compact ? "w-3 h-3" : "w-4 h-4"} ${
                    battlefieldElement?.toLowerCase().includes("water") &&
                    unit.water > unit.earth &&
                    unit.water > unit.fire
                      ? "text-blue-300 animate-pulse"
                      : "text-blue-300"
                  }`}
                />
                {getStatDisplay("water", unit.water, previousUnit?.water)}
              </div>
            </div>
          </div>
        </div>

        {/* Animation overlay for significant stat changes */}
        {showChanges &&
          previousUnit &&
          (unit.earth !== previousUnit.earth ||
            unit.fire !== previousUnit.fire ||
            unit.water !== previousUnit.water) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "0 0 30px 4px rgba(255, 255, 255, 0.7) inset",
                zIndex: 10,
              }}
            />
          )}
      </div>
    </div>
  );

  return (
    <Card
      className={`w-full ${compact ? "max-w-sm" : "max-w-md"} overflow-hidden`}
    >
      {cardContent}
    </Card>
  );
}
