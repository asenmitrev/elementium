import type React from "react";
import type { UnitType } from "types";

import Soldier from "./soldier";
interface SoldierListProps {
  soldiers: UnitType[];
}

const SoldierList: React.FC<SoldierListProps> = ({ soldiers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {soldiers.map((unit, index) => (
        <Soldier key={index} unit={unit} />
      ))}
    </div>
  );
};

export default SoldierList;
