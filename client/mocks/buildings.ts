import { Building } from "../../types";

export const buildingConfigs: Record<
  string,
  Omit<Building, "level" | "cost">
> = {
  walls: {
    name: "Castle Walls",
    type: "walls",
    description: "Fortified walls that protect your castle from invasions.",
    link: "/walls",
  },
  moat: {
    name: "Defensive Moat",
    type: "moat",
    description:
      "A water-filled trench that surrounds your castle, providing additional defense.",
  },
  magicShield: {
    name: "Magic Shield",
    type: "magicShield",
    description:
      "Magical barrier that protects against spells and elemental attacks.",
  },
  towers: {
    name: "Watch Towers",
    type: "towers",
    description: "Tall towers for surveillance and archer positioning.",
  },
  mine: {
    name: "Resource Mine",
    type: "mine",
    description: "Generates resources for your castle's economy.",
  },
  soldierGuild: {
    name: "Soldier Guild",
    type: "soldierGuild",
    description: "Train and manage your military units.",
    link: "/soldier-guild",
  },
  heroGuild: {
    name: "Hero Guild",
    type: "heroGuild",
    description: "Recruit and train powerful heroes.",
    link: "/hero-guild",
  },
  spyGuild: {
    name: "Spy Guild",
    type: "spyGuild",
    description: "Train spies and conduct espionage missions.",
  },
  counterEspionageGuild: {
    name: "Counter-Espionage Guild",
    type: "counterEspionageGuild",
    description: "Protect your castle from enemy spies.",
  },
  altar: {
    name: "Elemental Altar",
    type: "altar",
    description: "Channel elemental powers and perform rituals.",
    link: "/hero-altar",
  },
};

export function createBuilding(
  type: keyof typeof buildingConfigs,
  level: number,
  cost: number
): Building {
  return {
    ...buildingConfigs[type],
    level,
    cost,
  };
}
