import { Hero } from "@/types";

// Mock data for heroes
export const mockHeroes: Hero[] = [
  {
    type: {
      name: "Witch",
      wind: 90,
      water: 90,
      earth: 60,
      fire: 80,
      image: "/images/witch-water.jpg",
      slots: 3,
      evolutions: [],
    },
    level: 5,
    x: 10,
    y: 20,
    isAlive: true,
    units: [],
    player: "123e4567-e89b-12d3-a456-426614174003",
    experienceTillLevelUp: 1000,
    mission: null,
    alive: true,
  },
  {
    type: {
      name: "Mage",
      wind: 80,
      water: 70,
      earth: 90,
      fire: 60,
      image: "/images/mage-fire.png",
      slots: 3,
      evolutions: [],
    },
    level: 6,
    x: 10,
    y: 20,
    units: [],
    isAlive: true,
    player: "123e4567-e89b-12d3-a456-426614174000",
    experienceTillLevelUp: 1000,
    mission: null,
    alive: true,
  },
  {
    type: {
      name: "Warrior",
      wind: 65,
      water: 85,
      earth: 75,
      fire: 95,
      image: "/images/elemental-water.jpg",
      slots: 4,
      evolutions: [],
    },
    level: 7,
    x: 30,
    y: 40,
    units: [],
    player: "123e4567-e89b-12d3-a456-426614174001",
    isAlive: false,
    experienceTillLevelUp: 500,
    mission: null,
    alive: true,
  },
  {
    type: {
      name: "Archer",
      wind: 90,
      water: 90,
      earth: 60,
      fire: 80,
      image: "/images/earth-forest-creature.png",
      slots: 3,
      evolutions: [],
    },
    level: 8,
    x: null,
    y: null,
    units: [],
    player: "123e4567-e89b-12d3-a456-426614174002",
    experienceTillLevelUp: 750,
    mission: null,
    alive: false,
    isAlive: true,
  },
  {
    type: {
      name: "Warrior",
      wind: 90,
      water: 90,
      earth: 60,
      fire: 80,
      image: "/images/warrior-fire.jpg",
      slots: 3,
      evolutions: [],
    },
    level: 9,
    x: 10,
    y: 20,
    units: [],
    player: "123e4567-e89b-12d3-a456-426614174003",
    experienceTillLevelUp: 1000,
    mission: null,
    alive: true,
    isAlive: false,
  },
  {
    type: {
      name: "Elemental",
      wind: 90,
      water: 90,
      earth: 60,
      fire: 80,
      image: "/images/elemental-water-1.jpg",
      slots: 3,
      evolutions: [],
    },
    level: 10,
    x: 10,
    y: 20,
    units: [],
    isAlive: false,
    player: "123e4567-e89b-12d3-a456-426614174003",
    experienceTillLevelUp: 1000,
    mission: null,
    alive: true,
  },
];
