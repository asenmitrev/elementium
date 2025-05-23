import type React from "react";
import type { Unit, UnitType } from "types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSession } from "next-auth/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { HeroService } from "@/services/hero.service";
import Soldier from "./soldier";
import CardSlot from "./card-slot";

interface SoldierListProps {
  soldiers: Unit[];
  heroId?: string;
  maxSlots?: number;
  onAddUnit?: () => void;
}

const SoldierList: React.FC<SoldierListProps> = ({
  soldiers,
  heroId,
  maxSlots = 0,
  onAddUnit,
}) => {
  const { data: session } = useSession();
  const [localSoldiers, setLocalSoldiers] = useState(soldiers);
  const [isReordering, setIsReordering] = useState(false);
  const lastDragIndex = useRef<number | null>(null);
  const hasChanges = useRef(false);

  // Update local state when props change
  useEffect(() => {
    if (!hasChanges.current) {
      setLocalSoldiers(soldiers);
    }
  }, [soldiers]);

  const moveUnit = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      // Prevent unnecessary re-renders if the indices haven't changed
      if (dragIndex === hoverIndex || lastDragIndex.current === hoverIndex) {
        return;
      }
      lastDragIndex.current = hoverIndex;
      hasChanges.current = true;

      const newUnits = [...localSoldiers];
      const draggedUnit = newUnits[dragIndex];
      newUnits.splice(dragIndex, 1);
      newUnits.splice(hoverIndex, 0, draggedUnit);
      setLocalSoldiers(newUnits);
    },
    [localSoldiers]
  );

  const handleDragEnd = useCallback(async () => {
    if (!heroId || !session?.user.accessToken || !hasChanges.current) return;

    // Reset the last drag index
    lastDragIndex.current = null;

    setIsReordering(true);
    try {
      const unitIds = localSoldiers
        .map((unit) => unit._id)
        .filter((id): id is string => id !== undefined);
      const updatedHero = await HeroService.reorderUnits(
        heroId,
        unitIds,
        session.user.accessToken
      );
      hasChanges.current = false;
    } catch (error) {
      console.error("Error reordering units:", error);
      // Revert the order if the API call fails
      setLocalSoldiers(soldiers);
    } finally {
      setIsReordering(false);
    }
  }, [localSoldiers, heroId, session?.user.accessToken, soldiers]);

  // Calculate number of empty slots to show
  const emptySlots = Math.max(0, maxSlots - localSoldiers.length);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {localSoldiers.map((soldier, index) => (
          <Soldier
            key={soldier._id || index}
            unit={soldier.type}
            index={index}
            moveUnit={moveUnit}
            onDragEnd={handleDragEnd}
            isReordering={isReordering}
          />
        ))}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <CardSlot
            key={`empty-${index}`}
            onClick={onAddUnit}
            className="aspect-[4/3]"
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default SoldierList;
