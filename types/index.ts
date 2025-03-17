import { EffectMethods } from "./battle/effectUtils";

export type Castle = {
  _id: string;
  isCapital: boolean; //(if it is it cannot be attacked)
  x: number;
  y: number;
  type: "fire" | "water" | "earth";
  image: string;
  heroesStationed: Hero[];
  buildings: {
    walls: Building; //(+str if attacked)
    moat: Building; //(+agi if attacked)
    magicShield: Building; //(+int if attacked)
    towers: Building; //(how many defenders can you have)
    mine: Building; //( how much gold city generates per unit of time )
    soldierGuild: Building; //( how many different cards the city offers a day )
    heroGuild: Building; //( how many different cards the city offers a day )
    spyGuild: Building; //( Allows sending spy missions which might tell you order + army in a position)
    counterEspionageGuild: Building; //( prevents enemis from spying on this castle )
    altar: Building; //(summons hero + army it get's cheaper at higher level)
  };
  heroGuild: Hero[]; //(Size of the array is at maximum of heroGuildLevel but if you buy a hero it will not refresh till tomorrow)
  soldierGuild: Unit[]; //(Same as heroGuild)
  buildingOrder: {
    buildingOrdered: Omit<keyof Castle["buildings"], "buildingOrder">; //(one of the possible buildings)
    dateOfCompletion: Date;
  }[];
  owner: string;
};

export type Building = {
  name: string;
  level: number;
  type: keyof Castle["buildings"];
  link?: string;
  cost: number;
  description: string;
};

export type HeroType = {
  name: string;
  image: string;
  wind: number;
  earth: number;
  fire: number;
  water: number;
  slots: number;
  evolutions: HeroType[];
};

export type UnitTypeUserFacing = {
  effect: EffectMethods | null;
  earth: number;
  fire: number;
  water: number;
  name: string;
  specialExplanation: string;
  evolutions: UnitTypeUserFacing[];
  howManyPeopleHaveIt: number;
  level: number;
  image: string;
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
  _id: string;
  type: HeroType;
  x: number | null;
  y: number | null;
  units: UnitTypeUserFacing[];
  level: number;
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

export type UnitWeights = {
  water: number;
  earth: number;
  fire: number;
  special: number;
};

export type Land = "water" | "fire" | "earth";
