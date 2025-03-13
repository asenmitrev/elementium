import { UnitTypeUserFacing } from "@/types";

export const mockSoldiers: UnitTypeUserFacing[] = [
  {
    name: "Witch",
    water: 90,
    earth: 60,
    fire: 80,
    specialExplanation: "Delets other units",
    image: "/images/witch-water.jpg",
    effect: null,
    evolutions: [],
    howManyPeopleHaveIt: 100,
    level: 1,
  },
  {
    name: "Water Elemental",
    water: 70,
    earth: 75,
    fire: 95,
    specialExplanation: "Can attack from range",
    image: "/images/elemental-water-1.jpg",
    evolutions: [],
    howManyPeopleHaveIt: 85,
    level: 1,
    effect: null,

  },
  {
    name: "Earth Golem",
    water: 50,
    earth: 100,
    fire: 60,
    specialExplanation: "High defense against physical attacks",
    image: "/images/golem-earth.jpg",
    evolutions: [],
    howManyPeopleHaveIt: 120,
    level: 1,
    effect: null
  },
  {
    name: "Golem Earth 2",
    water: 40,
    earth: 55,
    fire: 100,
    specialExplanation: "Revives once per battle",
    image: "/images/golem-earth-2.jpg",
    evolutions: [],
    howManyPeopleHaveIt: 75,
    level: 1,
    effect: null
  },
  {
    name: "Earth Golem 2",
    water: 95,
    earth: 65,
    fire: 45,
    specialExplanation: "Is fucking great",
    image: "/images/golem-earth-2.jpg",
    evolutions: [],
    howManyPeopleHaveIt: 90,
    level: 1,
    effect: null
  },
  {
    name: "Storm Shaman",
    water: 85,
    earth: 80,
    fire: 70,
    specialExplanation: "Area of effect damage",
    image: "/images/shaman-water.jpg",
    evolutions: [],
    howManyPeopleHaveIt: 95,
    level: 1,
    effect: null
  },
];
