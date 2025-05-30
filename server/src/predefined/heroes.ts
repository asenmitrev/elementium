import { UnitType, Hero, HeroType, Unit } from "types";

const fireMageUnits: Partial<Unit>[] = [
  {
    type: {
      water: 10,
      earth: 2,
      fire: 5,
      name: "Frostwhisper Rimehoof",
      level: 0,
      effect: {
        stage: "pre",
        method: "epicBattle",
        methodArgs: {
          land: "earth",
          value: 2,
        },
        explanation:
          "After the battle buffs your earth stat by 2 if your army is smaller than the enemies",
      },
      specialExplanation: "",
      image: "earth/goat/20.jpeg",
      evolutions: [],
      race: {
        type: "earth",
        race: "goat",
        weights: {
          earth: 0.4,
          water: 0.05,
          fire: 0.25,
          special: 0.3,
        },
        names: [
          "Aeloria",
          "Brynhoof",
          "Crysthorn",
          "Drakemane",
          "Eldervine",
          "Frostwhisper",
          "Glimmerhoof",
          "Hollowpeak",
          "Ivyclimb",
          "Jasperhoof",
          "Kaelstone",
          "Lunamoss",
          "Mossveil",
          "Nimbusclimb",
          "Oakenhoof",
          "Pinewhisk",
          "Quillhorn",
          "Rimehoof",
          "Shimmerclimb",
          "Thornbreeze",
          "Ursagaze",
          "Veylstone",
          "Windsprint",
          "Xalvora",
          "Yewhoof",
          "Zephyrclimb",
          "Aurorock",
          "Bouldergaze",
          "Cloudleap",
          "Dawnstride",
        ],
        heroWeights: {
          water: 0,
          earth: 0.4,
          fire: 0,
          leadership: 0.4,
          wind: 0.2,
          counterEspionage: 0,
        },
        maxImages: 24,
        possibleEffects: [
          "buffActiveEffect",
          "buffMe",
          "epicBattle",
          "buffNextXCards",
        ],
      },
    },
    holder: null as any,
    experienceTillLevelUp: 100,
    order: 0,
  },
  {
    type: {
      water: 0,
      earth: 10,
      fire: 9,
      name: "Emberwash Dewflare",
      level: 0,
      effect: {
        stage: "pre",
        method: "attackerAdvantage",
        methodArgs: {
          value: 0,
        },
        explanation:
          "After the battle buffs your active stat by 0 if your are the attacker",
      },
      specialExplanation: "",
      image: "mixed/fireWaterElemental/7.jpeg",
      evolutions: [],
      race: {
        type: "mixed",
        race: "fireWaterElemental",
        weights: {
          earth: 0,
          water: 0.4,
          fire: 0.4,
          special: 0.2,
        },
        heroWeights: {
          water: 0.3,
          earth: 0,
          fire: 0.3,
          leadership: 0.1,
          wind: 0.2,
          counterEspionage: 0.1,
        },
        names: [
          "Pyroflux Tide",
          "Scorchwave",
          "Blazebrine",
          "Infernosh",
          "Steamspark",
          "Magmara",
          "Flareflow",
          "Torrentflare",
          "Hydrolight",
          "Cinderwash",
          "Emberglow",
          "Tiderupt",
          "Boilburst",
          "Vaporblaze",
          "Seasear",
          "Flamerip",
          "Sizzlespray",
          "Burnflow",
          "Scaldsurge",
          "Dewflare",
          "Spoutspark",
          "Lavalash",
          "Mistburn",
          "Geyserflare",
          "Blazebubble",
          "Seafire",
          "Tidekindle",
          "Floodflame",
          "Glowdrip",
          "Splashburn",
          "Brineblaze",
          "Frostfire",
          "Whirlflame",
          "Sprayflare",
          "Moltenmist",
          "Dantide",
          "Emberwash",
          "Blazewave",
          "Searspout",
          "Flamefroth",
          "Tideraze",
          "Vaporscorch",
          "Fireswell",
          "Hailfire",
          "Spoutflare",
          "Bubblesear",
          "Pyrospray",
          "Scaldspark",
          "Lagoonblaze",
          "Floodflare",
          "Sizzleswell",
          "Blazebrine",
          "Torchsurf",
          "Steamsear",
          "Flameripple",
          "Tidebrand",
          "Infernowash",
          "Glowtide",
          "Seaspark",
          "Burnishflow",
          "Sprayblaze",
          "Magmadrop",
          "Flarepool",
          "Searush",
          "Pyrotide",
          "Bubbleburn",
          "Flamespout",
          "Scaldsurge",
          "Vaporflame",
          "Tideroar",
          "Blazewash",
          "Frostflare",
          "Seaflicker",
        ],
        possibleEffects: [
          "buffMe",
          "removeEnemyEffectEffect",
          "attackerAdvantage",
          "debuffActiveEffect",
          "debuffEnemyEffect",
          "buffActiveEffect",
        ],
        maxImages: 17,
      },
    },
    holder: null as any,
    experienceTillLevelUp: 100,
    order: 0,
  },
  {
    type: {
      water: 9,
      earth: 1,
      fire: 8,
      name: "Shadewhisper Whisperbranch",
      level: 0,
      effect: {
        stage: "pre",
        method: "buffMe",
        methodArgs: {
          land: "fire",
          value: 0,
        },
        explanation: "After the battle buff your fire stat by 0",
      },
      specialExplanation: "",
      image: "mixed/forestDragon/1.jpeg",
      evolutions: [],
      race: {
        type: "mixed",
        race: "forestDragon",
        weights: {
          earth: 0.4,
          water: 0,
          fire: 0.4,
          special: 0.2,
        },
        heroWeights: {
          water: 0,
          earth: 0.3,
          fire: 0.3,
          leadership: 0,
          wind: 0.3,
          counterEspionage: 0.1,
        },
        names: [
          "Verdanthorn",
          "Emberbough",
          "Sylvanclaw",
          "Mosscrest",
          "Willowflame",
          "Thornspark",
          "Rootfang",
          "Bramblewing",
          "Leafdrake",
          "Groveheart",
          "Briarback",
          "Fernscale",
          "Canopyroar",
          "Timberflame",
          "Dewclaw",
          "Vinewrath",
          "Oakenshade",
          "Petalwing",
          "Twilightbark",
          "Hollowroot",
          "Gladegaze",
          "Bloomfang",
          "Shadewhisper",
          "Elderflame",
          "Barkhide",
          "Duskthorn",
          "Gleamleaf",
          "Frostbough",
          "Sunroot",
          "Whisperbranch",
          "Sproutspire",
          "Mirethorn",
          "Hazelstorm",
          "Silversap",
          "Duskgrove",
          "Thicketmaw",
          "Lichenscale",
          "Hollowvein",
          "Briarflame",
          "Moonbark",
          "Wildshroud",
          "Seedspark",
          "Glimmerroot",
          "Stormleaf",
          "Ashenbranch",
          "Tanglemane",
          "Frostpetal",
          "Galebough",
          "Mistwood",
          "Shadowfern",
          "Dewscale",
          "Bramblemane",
          "Embervein",
          "Hollowthorn",
          "Rustlewing",
          "Grovefang",
          "Duskshroud",
          "Sapflare",
          "Whisperthorn",
          "Bloomspark",
          "Rootshade",
          "Thornwhisper",
          "Barkflame",
          "Silvershroud",
          "Mossfang",
          "Gladewing",
          "Vineflare",
          "Sunscale",
          "Shadethorn",
          "Frostvein",
          "Timbergaze",
          "Leafspark",
          "Briarwhisper",
          "Willowshade",
          "Hollowroot",
        ],
        possibleEffects: [
          "buffMe",
          "removeEnemyEffectEffect",
          "attackerAdvantage",
          "defenderAdvantage",
        ],
        maxImages: 24,
      },
    },
    holder: null as any,
    experienceTillLevelUp: 100,
    order: 0,
  },
];
const earthGolemUnits: Partial<Unit>[] = [
  {
    type: {
      water: 9,
      earth: 2,
      fire: 5,
      name: "Yewhoof Thornbreeze",
      level: 0,
      effect: {
        stage: "after",
        method: "epicBattle",
        methodArgs: {
          land: "earth",
          value: 4,
        },
        explanation:
          "After the battle buffs your earth stat by 4 if your army is smaller than the enemies",
      },
      specialExplanation: "",
      image: "earth/goat/6.jpeg",
      evolutions: [],
      race: {
        type: "earth",
        race: "goat",
        weights: {
          earth: 0.4,
          water: 0.05,
          fire: 0.25,
          special: 0.3,
        },
        names: [
          "Aeloria",
          "Brynhoof",
          "Crysthorn",
          "Drakemane",
          "Eldervine",
          "Frostwhisper",
          "Glimmerhoof",
          "Hollowpeak",
          "Ivyclimb",
          "Jasperhoof",
          "Kaelstone",
          "Lunamoss",
          "Mossveil",
          "Nimbusclimb",
          "Oakenhoof",
          "Pinewhisk",
          "Quillhorn",
          "Rimehoof",
          "Shimmerclimb",
          "Thornbreeze",
          "Ursagaze",
          "Veylstone",
          "Windsprint",
          "Xalvora",
          "Yewhoof",
          "Zephyrclimb",
          "Aurorock",
          "Bouldergaze",
          "Cloudleap",
          "Dawnstride",
        ],
        heroWeights: {
          water: 0,
          earth: 0.4,
          fire: 0,
          leadership: 0.4,
          wind: 0.2,
          counterEspionage: 0,
        },
        maxImages: 24,
        possibleEffects: [
          "buffActiveEffect",
          "buffMe",
          "epicBattle",
          "buffNextXCards",
        ],
      },
    },
    holder: null as any,
    experienceTillLevelUp: 100,
    order: 0,
  },
  {
    type: {
      water: 4,
      earth: 1,
      fire: 13,
      name: "Blazefury Umbraforge",
      level: 0,
      effect: {
        stage: "after",
        method: "removeEnemyEffectEffect",
        methodArgs: {},
        explanation: "After the battle remove the opponents special effect",
      },
      specialExplanation: "",
      image: "fire/warrior/21.jpeg",
      evolutions: [],
      race: {
        type: "fire",
        race: "warrior",
        weights: {
          earth: 0.2,
          water: 0.05,
          fire: 0.65,
          special: 0.1,
        },
        names: [
          "Ignisblade",
          "Blazefury",
          "Cinderstrike",
          "Drakebrand",
          "Emberclash",
          "Flamewrath",
          "Glowhammer",
          "Heatbrand",
          "Infernoaxe",
          "Jetshard",
          "Kindleblade",
          "Lavabreaker",
          "Magmastrike",
          "Novaforge",
          "Obsidianblade",
          "Pyrebane",
          "Quickshield",
          "Radiantblaze",
          "Scorchblade",
          "Thermalstrike",
          "Umbraforge",
          "Vulcanblade",
          "Wildfire",
          "Xanthor",
          "Yflareblade",
          "Zephyrash",
          "Ashstrike",
          "Blazeguard",
          "Cinderaxe",
          "Duskblaze",
        ],
        heroWeights: {
          water: 0,
          earth: 0,
          fire: 0.4,
          leadership: 0.4,
          wind: 0.2,
          counterEspionage: 0,
        },
        maxImages: 25,
        possibleEffects: [
          "buffMe",
          "removeEnemyEffectEffect",
          "attackerAdvantage",
        ],
      },
    },
    holder: null as any,
    experienceTillLevelUp: 100,
    order: 0,
  },
  {
    type: {
      water: 8,
      earth: 11,
      fire: 0,
      name: "Levi Lucky",
      level: 0,
      effect: {
        stage: "pre",
        method: "defenderAdvantage",
        methodArgs: {
          value: 0,
        },
        explanation:
          "After the battle buffs your active stat by 0 if your are the defender",
      },
      specialExplanation: "",
      image: "water/turtle/6.jpeg",
      evolutions: [],
      race: {
        type: "water",
        race: "turtle",
        weights: {
          earth: 0.35,
          water: 0.55,
          fire: 0,
          special: 0.1,
        },
        heroWeights: {
          water: 0.45,
          earth: 0.35,
          fire: 0,
          leadership: 0.1,
          wind: 0.1,
          counterEspionage: 0,
        },
        names: [
          "Shelly",
          "Crush",
          "Squirt",
          "Turbo",
          "Marina",
          "Bubbles",
          "Coral",
          "Paddle",
          "Finn",
          "Nemo",
          "Tidal",
          "Lagoon",
          "Azul",
          "Surf",
          "Waverly",
          "Kai",
          "Pearl",
          "Sandy",
          "Shelldon",
          "Marlin",
          "Tortuga",
          "Cove",
          "Dory",
          "Pebbles",
          "Splash",
          "Breeze",
          "Cucumber",
          "Dune",
          "Ebb",
          "Flipper",
          "Gill",
          "Honey",
          "Indigo",
          "Jade",
          "Kelp",
          "Lucky",
          "Misty",
          "Nova",
          "Oceanus",
          "Poseidon",
          "Quill",
          "Ripple",
          "Sapphire",
          "Tide",
          "Umi",
          "Vortex",
          "Winston",
          "Xena",
          "Yara",
          "Zuma",
          "Algae",
          "Barnaby",
          "Chip",
          "Dewey",
          "Echo",
          "Fathom",
          "Glider",
          "Harbor",
          "Isla",
          "Jetty",
          "Koa",
          "Levi",
          "Mango",
          "Nixie",
          "Orca",
          "Pip",
          "Quest",
          "Reef",
          "Scooter",
          "Tango",
          "Urchin",
          "Vega",
          "Wash",
          "Yoshi",
          "Ziggy",
        ],
        maxImages: 25,
        possibleEffects: ["defenderAdvantage"],
      },
    },
    holder: null as any,
    experienceTillLevelUp: 100,
    order: 0,
  },
];
const waterWitchUnits: Partial<Unit>[] = [
  {
    type: {
      water: 10,
      earth: 2,
      fire: 6,
      name: "Cloudleap Brynhoof",
      level: 0,
      effect: {
        stage: "pre",
        method: "buffActiveEffect",
        methodArgs: {
          value: 0,
        },
        explanation: "After the battle buff your active stat by 0",
      },
      specialExplanation: "",
      image: "earth/goat/6.jpeg",
      evolutions: [],
      race: {
        type: "earth",
        race: "goat",
        weights: {
          earth: 0.4,
          water: 0.05,
          fire: 0.25,
          special: 0.3,
        },
        names: [
          "Aeloria",
          "Brynhoof",
          "Crysthorn",
          "Drakemane",
          "Eldervine",
          "Frostwhisper",
          "Glimmerhoof",
          "Hollowpeak",
          "Ivyclimb",
          "Jasperhoof",
          "Kaelstone",
          "Lunamoss",
          "Mossveil",
          "Nimbusclimb",
          "Oakenhoof",
          "Pinewhisk",
          "Quillhorn",
          "Rimehoof",
          "Shimmerclimb",
          "Thornbreeze",
          "Ursagaze",
          "Veylstone",
          "Windsprint",
          "Xalvora",
          "Yewhoof",
          "Zephyrclimb",
          "Aurorock",
          "Bouldergaze",
          "Cloudleap",
          "Dawnstride",
        ],
        heroWeights: {
          water: 0,
          earth: 0.4,
          fire: 0,
          leadership: 0.4,
          wind: 0.2,
          counterEspionage: 0,
        },
        maxImages: 24,
        possibleEffects: [
          "buffActiveEffect",
          "buffMe",
          "epicBattle",
          "buffNextXCards",
        ],
      },
    },
    holder: null as any,
    experienceTillLevelUp: 100,
    order: 0,
  },
  {
    type: {
      water: 2,
      earth: 2,
      fire: 12,
      name: "Solaire Celestia",
      level: 0,
      effect: {
        stage: "after",
        method: "revive",
        methodArgs: {},
        explanation:
          "If you have less power than the enemy place your card at the end of your deck instead of the graveyard but lose this effect for the rest of the battle.",
      },
      specialExplanation: "",
      image: "fire/phoenix/19.jpeg",
      evolutions: [],
      race: {
        type: "fire",
        race: "phoenix",
        weights: {
          earth: 0.1,
          water: 0.1,
          fire: 0.6,
          special: 0.2,
        },
        heroWeights: {
          water: 0,
          earth: 0,
          fire: 0.5,
          leadership: 0,
          wind: 0.4,
          counterEspionage: 0.1,
        },
        names: [
          "Ember",
          "Pyre",
          "Solarius",
          "Ignis",
          "Blaze",
          "Fawkes",
          "Ashen",
          "Cinder",
          "Solaris",
          "Vulcan",
          "Inferno",
          "Scorch",
          "Helios",
          "Rekindle",
          "Phoenixia",
          "Aurelian",
          "Flare",
          "Sear",
          "Brimstone",
          "Magmus",
          "Ragnarok",
          "Solaire",
          "Char",
          "Wildfire",
          "Zephyros",
          "Balthazar",
          "Incendius",
          "Radiant",
          "Sunflare",
          "Volcanis",
          "Eldrin",
          "Lumos",
          "Novaflare",
          "Onyxia",
          "Pyrrha",
          "Quicksilver",
          "Ravenshade",
          "Smolder",
          "Therion",
          "Uriel",
          "Vesuvius",
          "Wildspark",
          "Xanthe",
          "Yggdrasil",
          "Zarathos",
          "Aetheris",
          "Briarblaze",
          "Crimsonwing",
          "Drakon",
          "Ebonflame",
          "Firebrand",
          "Goldfeather",
          "Hestia",
          "Icarion",
          "Jadeflare",
          "Kaelthas",
          "Lavaborn",
          "Mythrandir",
          "Nirvana",
          "Obsidian",
          "Phaedra",
          "Quetzal",
          "Rising Dawn",
          "Starborn",
          "Tempest",
          "Undying Light",
          "Valkyrie",
          "Warbringer",
          "Xerxes",
          "Yvaine",
          "Zircon",
          "Aurora",
          "Burning Sky",
          "Celestia",
          "Dawnfire",
        ],
        possibleEffects: [
          "buffMe",
          "removeEnemyEffectEffect",
          "attackerAdvantage",
          "revive",
        ],
        maxImages: 24,
      },
    },
    holder: null as any,
    experienceTillLevelUp: 100,
    order: 0,
  },
  {
    type: {
      water: 3,
      earth: 1,
      fire: 15,
      name: "Umbraforge Yflareblade",
      level: 0,
      effect: {
        stage: "after",
        method: "removeEnemyEffectEffect",
        methodArgs: {},
        explanation: "After the battle remove the opponents special effect",
      },
      specialExplanation: "",
      image: "fire/warrior/15.jpeg",
      evolutions: [],
      race: {
        type: "fire",
        race: "warrior",
        weights: {
          earth: 0.2,
          water: 0.05,
          fire: 0.65,
          special: 0.1,
        },
        names: [
          "Ignisblade",
          "Blazefury",
          "Cinderstrike",
          "Drakebrand",
          "Emberclash",
          "Flamewrath",
          "Glowhammer",
          "Heatbrand",
          "Infernoaxe",
          "Jetshard",
          "Kindleblade",
          "Lavabreaker",
          "Magmastrike",
          "Novaforge",
          "Obsidianblade",
          "Pyrebane",
          "Quickshield",
          "Radiantblaze",
          "Scorchblade",
          "Thermalstrike",
          "Umbraforge",
          "Vulcanblade",
          "Wildfire",
          "Xanthor",
          "Yflareblade",
          "Zephyrash",
          "Ashstrike",
          "Blazeguard",
          "Cinderaxe",
          "Duskblaze",
        ],
        heroWeights: {
          water: 0,
          earth: 0,
          fire: 0.4,
          leadership: 0.4,
          wind: 0.2,
          counterEspionage: 0,
        },
        maxImages: 25,
        possibleEffects: [
          "buffMe",
          "removeEnemyEffectEffect",
          "attackerAdvantage",
        ],
      },
    },
    holder: null as any,
    experienceTillLevelUp: 100,
    order: 0,
  },
];
export const predefinedHeroTypes: (HeroType & { units: Partial<Unit>[] })[] = [
  {
    water: 5,
    earth: 3,
    fire: 3,
    leadership: 3,
    wind: 3,
    counterEspionage: 3,
    name: "Radiantash Therion",
    evolutions: [],
    howManyPeopleHaveIt: 0,
    image: "fire/mage/17.jpeg",
    units: fireMageUnits,
    level: 0,
    race: {
      type: "fire",
      race: "mage",
      weights: { earth: 0.1, water: 0.05, fire: 0.5, special: 0.35 },
      names: [
        "Pyrothius",
        "Blazeweaver",
        "Cinderflare",
        "Drakefury",
        "Emberlyn",
        "Flamecaller",
        "Glowspire",
        "Heathenblaze",
        "Infernara",
        "Jetscar",
        "Kindlevoid",
        "Lavabrand",
        "Magmara",
        "Novaflare",
        "Obsidianflare",
        "Pyrelight",
        "Quickspark",
        "Radiantash",
        "Scorchveil",
        "Therion",
        "Umbraflame",
        "Vulcanis",
        "Wildspark",
        "Xantheros",
        "Yflareon",
        "Zephyrember",
        "Ashthorn",
        "Blazebinder",
        "Cindervane",
        "Duskspark",
      ],
      heroWeights: {
        water: 0,
        earth: 0,
        fire: 0.6,
        leadership: 0.1,
        wind: 0.2,
        counterEspionage: 0.1,
      },
      maxImages: 24,
    },
  },
  {
    water: 4,
    earth: 3,
    fire: 3,
    leadership: 3,
    wind: 3,
    counterEspionage: 4,
    name: "Bouldergrim Nethrock",
    evolutions: [],
    units: earthGolemUnits,
    howManyPeopleHaveIt: 0,
    image: "earth/golem/19.jpeg",
    level: 0,
    race: {
      type: "earth",
      race: "golem",
      weights: { earth: 0.6, water: 0.2, fire: 0.15, special: 0.05 },
      names: [
        "Terranthos",
        "Bouldergrim",
        "Cragvein",
        "Dustforge",
        "Earthenshard",
        "Fossilheart",
        "Graniteclaw",
        "Hollowstone",
        "Ironroot",
        "Jadefist",
        "Kragmire",
        "Loamspire",
        "Mossmantle",
        "Nethrock",
        "Orebound",
        "Pebblecore",
        "Quartzbreaker",
        "Rubblethorn",
        "Stonewarden",
        "Thaloss",
        "Umberfist",
        "Verdigris",
        "Woldstone",
        "Xerolith",
        "Yarrowspire",
        "Zirconclash",
        "Aridspire",
        "Basaltgrip",
        "Clayrend",
        "Dunewarden",
      ],
      heroWeights: {
        water: 0.1,
        earth: 0.5,
        fire: 0,
        leadership: 0.1,
        wind: 0.1,
        counterEspionage: 0.2,
      },
      maxImages: 24,
      possibleEffects: ["buffMe", "debuffActiveEffect", "defenderAdvantage"],
    },
  },
  {
    water: 5,
    earth: 3,
    fire: 3,
    leadership: 3,
    wind: 3,
    counterEspionage: 3,
    name: "Xanthea Frostara",
    evolutions: [],
    units: waterWitchUnits,
    howManyPeopleHaveIt: 0,
    image: "water/witch/19.jpeg",
    level: 0,
    race: {
      type: "water",
      race: "witch",
      weights: { earth: 0.15, water: 0.5, fire: 0.05, special: 0.35 },
      heroWeights: {
        water: 0.5,
        earth: 0.1,
        fire: 0,
        leadership: 0.2,
        wind: 0.2,
        counterEspionage: 0.1,
      },
      names: [
        "Aquarina",
        "Brineveil",
        "Coralyn",
        "Dewshade",
        "Ebbra",
        "Frostara",
        "Glacielle",
        "Hydralis",
        "Icelily",
        "Jadecrest",
        "Koralith",
        "Lunara",
        "Mistwraith",
        "Naiadra",
        "Oceara",
        "Pearlspell",
        "Quellara",
        "Ripplewhisper",
        "Seafrost",
        "Tidebinder",
        "Undinara",
        "Vaporlyn",
        "Wavecrest",
        "Xanthea",
        "Yaralune",
        "Zephyra",
        "Abyssara",
        "Brinewhisper",
        "Coralbreeze",
        "Dewspell",
      ],
      maxImages: 25,
      possibleEffects: [
        "removeEnemyEffectEffect",
        "buffActiveEffect",
        "buffMe",
        "debuffEnemyEffect",
        "defenderAdvantage",
        "attackerAdvantage",
      ],
    },
  },
];
