import type React from "react";
import type { Hero as IHero, Unit } from "types";

import Hero from "./hero";
interface HeroListProps {
  heroes: (IHero & { units: Unit[] })[];
}

const HeroList: React.FC<HeroListProps> = ({ heroes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {heroes.map((hero, index) => (
        <Hero
          key={index}
          hero={hero.type}
          units={hero.units?.map((unit) => unit.type) ?? []}
          heroId={hero._id}
        />
      ))}
    </div>
  );
};

export default HeroList;
