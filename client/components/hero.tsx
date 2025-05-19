import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Wind, Droplets, Mountain, Flame, GripVertical } from "lucide-react";
import { Hero, HeroType, Unit, UnitType } from "types";
import Image from "next/image";
import Link from "next/link";
import { DndProvider, useDrag, useDrop, DragSourceMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSession } from "next-auth/react";
import { HeroService } from "@/services/hero.service";
import { useState, useCallback, useRef, useEffect } from "react";

interface DraggableUnitProps {
  unit: UnitType;
  index: number;
  moveUnit: (dragIndex: number, hoverIndex: number) => void;
  heroId: string;
  handleDragEnd: () => void;
}

const DraggableUnit = ({
  unit,
  index,
  moveUnit,
  heroId,
  handleDragEnd,
}: DraggableUnitProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: "UNIT",
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      handleDragEnd();
    },
  });

  const [, drop] = useDrop({
    accept: "UNIT",
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical and horizontal middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Get pixels to the top and left
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Calculate the distance from the center
      const distanceFromCenter = Math.sqrt(
        Math.pow(hoverClientX - hoverMiddleX, 2) +
          Math.pow(hoverClientY - hoverMiddleY, 2)
      );

      // Only perform the move when the mouse has crossed the center threshold
      const centerThreshold = Math.min(hoverMiddleX, hoverMiddleY) * 0.5;

      if (distanceFromCenter < centerThreshold) {
        return;
      }

      // Time to actually perform the action
      moveUnit(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`group relative flex flex-col items-center ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="relative w-full aspect-square">
        <div className="absolute top-1 left-1 z-10 cursor-move">
          <GripVertical className="w-4 h-4 text-white/50 hover:text-white" />
        </div>
        <Image
          src={`/images/units/${unit.image}`}
          alt={unit.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60">
          <div className="flex absolute top-1 left-8 items-center gap-1 text-xs text-white group-hover:text-white/90 transition-colors">
            <span>{unit.name}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-1 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-white">
                <Droplets className="w-4 h-4 text-blue-300" />
                <span className="font-medium">{unit.water}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Mountain className="w-4 h-4 text-green-300" />
                <span className="font-medium">{unit.earth}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Flame className="w-4 h-4 text-orange-300" />
                <span className="font-medium">{unit.fire}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HeroCard({
  hero,
  units,
  link,
  showArmy = true,
  heroId,
  noLink = false,
}: {
  hero: HeroType;
  heroId?: string;
  units: Unit[];
  link?: string;
  noLink?: boolean;
  showArmy?: boolean;
}) {
  const { data: session } = useSession();
  const [localUnits, setLocalUnits] = useState(units);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    setLocalUnits(units);
  }, [units]);

  const moveUnit = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      const newUnits = [...localUnits];
      const draggedUnit = newUnits[dragIndex];
      newUnits.splice(dragIndex, 1);
      newUnits.splice(hoverIndex, 0, draggedUnit);
      setLocalUnits(newUnits);
    },
    [localUnits]
  );

  const handleDragEnd = useCallback(async () => {
    if (!heroId || !session?.user.accessToken) return;

    setIsReordering(true);
    try {
      const unitIds = localUnits
        .map((unit) => unit._id)
        .filter((id): id is string => id !== undefined);
      await HeroService.reorderUnits(heroId, unitIds, session.user.accessToken);
    } catch (error) {
      console.error("Error reordering units:", error);
      // Revert the order if the API call fails
      setLocalUnits(units);
    } finally {
      setIsReordering(false);
    }
  }, [localUnits, heroId, session?.user.accessToken, units]);

  const LinkComponent = noLink ? "div" : Link;
  return (
    <Card className="w-full max-w-md overflow-hidden flex flex-col">
      <div className="relative group">
        <LinkComponent href={link ?? (heroId ? `/hero/${heroId}` : `/heroes`)}>
          <div className="relative aspect-[4/3]">
            <Image
              src={`/images/units/${hero.image}`}
              alt="Hero"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              fill
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90">
              <div className="absolute top-0 left-0 right-0 p-4">
                <h2 className="text-2xl font-bold text-white flex items-center justify-between">
                  {hero.name}
                  <Badge
                    className={`${"bg-red-500/20 text-red-300 hover:bg-red-500/30"}`}
                  >
                    Active
                  </Badge>
                </h2>
                <div className="text-sm text-white font-medium">
                  Level: {hero.level}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white">
                    <Wind className="w-4 h-4 text-gray-300" />
                    <span className="font-medium ">{hero.wind}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Droplets className="w-4 h-4 text-blue-300" />
                    <span className="font-medium">{hero.water}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Mountain className="w-4 h-4 text-green-300" />
                    <span className="font-medium">{hero.earth}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Flame className="w-4 h-4 text-orange-300" />
                    <span className="font-medium">{hero.fire}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LinkComponent>
      </div>

      {!showArmy ? null : localUnits.length > 0 ? (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-3 gap-0">
            {localUnits.map((unit, index) => (
              <DraggableUnit
                key={unit._id || index}
                unit={unit.type}
                index={index}
                moveUnit={moveUnit}
                heroId={heroId || ""}
                handleDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </DndProvider>
      ) : (
        <div className="flex h-full items-center justify-center flex-grow text-xs text-gray-500 py-4 px-4">
          This hero does not have an army.
        </div>
      )}
    </Card>
  );
}
