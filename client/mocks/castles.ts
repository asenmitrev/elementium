import { Castle } from "@/types";
import { createBuilding } from "./buildings";

export const mockCastles: Castle[] = [
  {
    _id: "1",
    isCapital: true,
    x: 100,
    y: 100,
    type: "fire",
    image: "/images/castle-fire.jpg",
    heroesStationed: [], // Will be populated with heroes later
    buildings: {
      walls: createBuilding("walls", 3, 1000),
      moat: createBuilding("moat", 1, 500),
      magicShield: createBuilding("magicShield", 2, 800),
      towers: createBuilding("towers", 2, 750),
      mine: createBuilding("mine", 3, 1200),
      soldierGuild: createBuilding("soldierGuild", 2, 900),
      heroGuild: createBuilding("heroGuild", 2, 1500),
      spyGuild: createBuilding("spyGuild", 1, 600),
      counterEspionageGuild: createBuilding("counterEspionageGuild", 1, 700),
      altar: createBuilding("altar", 2, 1000),
    },
    heroGuild: [], // Will be populated with fire-based heroes
    soldierGuild: [],
    buildingOrder: [
      {
        buildingOrdered: "towers",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
      {
        buildingOrdered: "walls",
        dateOfCompletion: new Date(Date.now() + 7200000), // 2 hours from now
      },
      {
        buildingOrdered: "moat",
        dateOfCompletion: new Date(Date.now() + 5400000), // 1.5 hours from now
      },
      {
        buildingOrdered: "magicShield",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
      {
        buildingOrdered: "mine",
        dateOfCompletion: new Date(Date.now() + 4500000), // 1.25 hours from now
      },
      {
        buildingOrdered: "soldierGuild",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
      {
        buildingOrdered: "heroGuild",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
      {
        buildingOrdered: "spyGuild",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
      {
        buildingOrdered: "counterEspionageGuild",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
      {
        buildingOrdered: "altar",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
    ],
  },
  {
    _id: "2",
    isCapital: false,
    x: 200,
    y: 150,
    type: "water",
    image: "/images/castle-water.jpg",
    heroesStationed: [],
    buildings: {
      walls: createBuilding("walls", 2, 800),
      moat: createBuilding("moat", 3, 1200), // Higher moat for water castle
      magicShield: createBuilding("magicShield", 2, 800),
      towers: createBuilding("towers", 1, 500),
      mine: createBuilding("mine", 2, 900),
      soldierGuild: createBuilding("soldierGuild", 2, 900),
      heroGuild: createBuilding("heroGuild", 1, 1000),
      spyGuild: createBuilding("spyGuild", 2, 800),
      counterEspionageGuild: createBuilding("counterEspionageGuild", 1, 700),
      altar: createBuilding("altar", 1, 800),
    },
    heroGuild: [], // Will be populated with water-based heroes
    soldierGuild: [], // Will be
    buildingOrder: [
      {
        buildingOrdered: "moat",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
    ],
  },
  {
    _id: "3",
    isCapital: false,
    x: 150,
    y: 250,
    type: "earth",
    image: "/images/castle-earth.jpg",
    heroesStationed: [],
    buildings: {
      walls: createBuilding("walls", 4, 1500), // Higher walls for earth castle
      moat: createBuilding("moat", 1, 500),
      magicShield: createBuilding("magicShield", 1, 600),
      towers: createBuilding("towers", 3, 1000),
      mine: createBuilding("mine", 4, 1600), // Higher mine level for earth castle
      soldierGuild: createBuilding("soldierGuild", 2, 900),
      heroGuild: createBuilding("heroGuild", 1, 1000),
      spyGuild: createBuilding("spyGuild", 1, 600),
      counterEspionageGuild: createBuilding("counterEspionageGuild", 2, 900),
      altar: createBuilding("altar", 1, 800),
    },
    heroGuild: [], // Will be populated with earth-based heroes
    soldierGuild: [],
    buildingOrder: [
      {
        buildingOrdered: "walls",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
      {
        buildingOrdered: "magicShield",
        dateOfCompletion: new Date(Date.now() + 7200000), // 2 hours from now
      },
      {
        buildingOrdered: "altar",
        dateOfCompletion: new Date(Date.now() + 5400000), // 1.5 hours from now
      },
      {
        buildingOrdered: "moat",
        dateOfCompletion: new Date(Date.now() + 3600000), // 1 hour from now
      },
    ],
  },
];
