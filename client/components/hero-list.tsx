import type React from "react";
import type { Hero as IHero } from "../../types";

import Hero from "./hero";
interface HeroListProps {
  heroes: IHero[];
}

const HeroList: React.FC<HeroListProps> = ({ heroes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {heroes.map((hero, index) => (
        <Hero key={index} hero={hero} />
      ))}
    </div>
  );
};

export default HeroList;
