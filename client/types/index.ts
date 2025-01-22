export type Castle = {
  isCapital: boolean; //(if it is it cannot be attacked)
  x: number;
  y: number;
  heroesStationed: Hero[];
  buildings: {
    walls: { level: number; cost: number }; //(+str if attacked)
    moat: { level: number; cost: number }; //(+agi if attacked)
    magicShield: { level: number; cost: number }; //(+int if attacked)
    towers: { level: number; cost: number }; //(how many defenders can you have)
    mine: { level: number; cost: number }; //( how much gold city generates per unit of time )
    heroGuild: { level: number; cost: number }; //( how many different cards the city offers a day )
    spyGuild: { level: number; cost: number }; //( Allows sending spy missions which might tell you order + army in a position)
    counterEspionageGuild: { level: number; cost: number }; //( prevents enemis from spying on this castle )
    altar: { level: number; cost: number }; //(summons hero + army it get's cheaper at higher level)
    buildingOrder: {
      buildingOrdered: Omit<keyof Castle["buildings"], "buildingOrder">; //(one of the possible buildings)
      dateOfCompletion: Date;
    };
  };
  heroGuild: Hero[]; //(Size of the array is at maximum of heroGuildLevel but if you buy a hero it will not refresh till tomorrow)
  soldierGuild: Unit[]; //(Same as heroGuild)
  buildingOrder: {
    buildingOrdered: keyof Castle["buildings"]; //(one of the possible buildings)
    dateOfCompletion: Date;
  };
};

export type Building = {
  name: string;
  level: number;
  type: keyof Castle["buildings"];
  cost: number;
  description: string;
  effect: string;
};

export type HeroType = {
  image: string;
  wind: number;
  earth: number;
  fire: number;
  water: number;
  slots: number;
  evolutions: HeroType[];
  level: number;
};

export type UnitTypeUserFacing = {
  earth: number;
  fire: number;
  water: number;
  specialExplanation: string;
  evolutions: UnitTypeUserFacing[];
  howManyPeopleHaveIt: number;
  level: number;
};

export type Unit = {
  type: UnitTypeUserFacing;
  holder: Castle | Hero;
  experienceTillLevelUp: number;
};
export type HeroTypeUserFacing = {
  wind: number;
  earth: number;
  fire: number;
  water: number;
  slots: number;
  evolutions: HeroType[];
  howManyPeopleHaveIt: number;
  level: number;
  counterEspionageLevel: number;
};

export type Hero = {
  type: HeroType;
  x: number | null;
  y: number | null;
  units: Unit[];
  player: string;
  experienceTillLevelUp: number;
  mission: Mission | null;
  alive: boolean;
};

export type Mission = {
  destinationX: number;
  destinationY: number;
  travelTime: Date; ///(Different type of event executes depending on what is in the destination square at the time of arrival)
};
