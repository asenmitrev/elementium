import { Building } from "types";

export const BUILDING_CONFIGS: Record<
  string,
  { name: string; description: string; link?: string }
> = {
  walls: {
    name: "Castle Walls",
    description: "Fortified walls that protect your castle from invasions.",
    link: "walls",
  },
  moat: {
    name: "Defensive Moat",
    description:
      "A water-filled trench that surrounds your castle, providing additional defense.",
  },
  magicShield: {
    name: "Magic Shield",
    description:
      "Magical barrier that protects against spells and elemental attacks.",
  },
  towers: {
    name: "Watch Towers",
    description: "Tall towers for surveillance and archer positioning.",
  },
  mine: {
    name: "Resource Mine",
    description: "Generates resources for your castle's economy.",
  },
  soldierGuild: {
    name: "Soldier Guild",
    description: "Train and manage your military units.",
    link: "soldier-guild",
  },
  heroGuild: {
    name: "Hero Guild",
    description: "Recruit and train powerful heroes.",
    link: "hero-guild",
  },
  spyGuild: {
    name: "Spy Guild",
    description: "Train spies and conduct espionage missions.",
  },
  counterEspionageGuild: {
    name: "Counter-Espionage Guild",
    description: "Protect your castle from enemy spies.",
  },
  altar: {
    name: "Elemental Altar",
    description: "Channel elemental powers and perform rituals.",
    link: "hero-altar",
  },
};
