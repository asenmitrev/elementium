import { HeroWeights, UnitWeights } from ".";
import { EffectKeys } from "./battle/effects";

export type UnitRaceData = {
    weights: UnitWeights;
    names: string[];
    type: string;
    race: string;
    maxImages: number;
    heroWeights?: HeroWeights;
    possibleEffects?:EffectKeys[];
}

type UnitRaceKey = 'earth-goat' | 'earth-golem' | 'fire-mage' | 'fire-warrior' | 'water-witch' | 'fire-phoenix'
| 'earth-forestSpirit' | 'water-octopus' | 'water-turtle' | 'mixed-fireWaterElemental' | 'mixed-forestDragon' | 'mixed-hipo' |
'mixed-natureElemental';

export const unitRaces: Map<UnitRaceKey, UnitRaceData> = new Map([
    //Earth
    ['earth-goat', {
        type:"earth",
        race:"goat",
        weights: {
            'earth': 0.4,
            'water': 0.05,
            'fire': 0.25,
            'special': 0.3
        },
        names: [
            "Aeloria", "Brynhoof", "Crysthorn", "Drakemane", "Eldervine",
            "Frostwhisper", "Glimmerhoof", "Hollowpeak", "Ivyclimb", "Jasperhoof",
            "Kaelstone", "Lunamoss", "Mossveil", "Nimbusclimb", "Oakenhoof",
            "Pinewhisk", "Quillhorn", "Rimehoof", "Shimmerclimb", "Thornbreeze",
            "Ursagaze", "Veylstone", "Windsprint", "Xalvora", "Yewhoof",
            "Zephyrclimb", "Aurorock", "Bouldergaze", "Cloudleap", "Dawnstride"
        ],
        heroWeights: {
            water:0,
            earth:0.4,
            fire:0,
            leadership:0.4,
            wind:0.2,
            counterEspionage:0,
        },
        maxImages: 24,
        possibleEffects: [
           "buffActiveEffect",
           "buffMeEffect",
           "epicBattle",
           "buffNextXCards"
        ]
    }],
    ['earth-golem', {
        type:"earth",
        race:"golem",
        weights: {
            'earth': 0.6,
            'water': 0.2,
            'fire': 0.15,
            'special': 0.05
        },
        names: [
            "Terranthos", "Bouldergrim", "Cragvein", "Dustforge", "Earthenshard",
            "Fossilheart", "Graniteclaw", "Hollowstone", "Ironroot", "Jadefist",
            "Kragmire", "Loamspire", "Mossmantle", "Nethrock", "Orebound",
            "Pebblecore", "Quartzbreaker", "Rubblethorn", "Stonewarden", "Thaloss",
            "Umberfist", "Verdigris", "Woldstone", "Xerolith", "Yarrowspire",
            "Zirconclash", "Aridspire", "Basaltgrip", "Clayrend", "Dunewarden"
        ],
        heroWeights: {
            water:0.1,
            earth:0.5,
            fire:0,
            leadership:0.1,
            wind:0.1,
            counterEspionage:0.2,
        },
        maxImages: 24,
        possibleEffects: [
            "buffMeEffect",
            "debuffActiveEffect",
            "defenderAdvantage"
         ]
    }],
    
    ['earth-forestSpirit', {
        type:"earth",
        race:"forstSpirit",
        weights: {
            'earth': 0.4,
            'water': 0.2,
            'fire': 0.2,
            'special': 0.2
        },
        names: [
            "Barrowwhisper", "Hollowveil", "Mossghast", "Rootwraith", "Thornshade",
            "Gloamroot", "Witherbough", "Duskmire", "Blightbark", "Shadeweaver",
            "Funguswight", "Brambleghoul", "Rotlimb", "Vinegloom", "Moldermaw",
            "Sapscowl", "Gallowsmoss", "Petalash", "Bogshriek", "Murkthorn",
            "Mournwhisper", "Hushbriar", "Grimsap", "Omenroot", "Dreadwillow",
            "Sighbark", "Croakmire", "Wailtwig", "Murmurleaf", "Hollowcroon",
            "Stagskull", "Mothbone", "Crowclaw", "Wormtusk", "Hollowhoof",
            "Antlerrot", "Frogrim", "Snagglefang", "Webfoot", "Bonewhistle",
            "Oldenwane", "Eldermurk", "Duskeld", "Withersage", "Grimsylvan",
            "Mirelore", "Barrowgloom", "Fossilbough", "Sallowroot", "Deadfolk"
        ],
        heroWeights: {
            water:0.1,
            earth:0.3,
            fire:0.1,
            leadership:0.1,
            wind:0.1,
            counterEspionage:0.3,
        },
        maxImages: 28,
        possibleEffects: [
            "debuffActiveEffect",
            "debuffEnemyEffect",
            "removeEnemyEffectEffect",
            "debuffNextXCards",
            "domination"
         ]
    }],

    //Fire
    ['fire-mage', {
        type:"fire",
        race:"mage",
        weights: {
            'earth': 0.1,
            'water': 0.05,
            'fire': 0.5,
            'special': 0.35
        },
        names: [
            "Pyrothius", "Blazeweaver", "Cinderflare", "Drakefury", "Emberlyn",
            "Flamecaller", "Glowspire", "Heathenblaze", "Infernara", "Jetscar",
            "Kindlevoid", "Lavabrand", "Magmara", "Novaflare", "Obsidianflare",
            "Pyrelight", "Quickspark", "Radiantash", "Scorchveil", "Therion",
            "Umbraflame", "Vulcanis", "Wildspark", "Xantheros", "Yflareon",
            "Zephyrember", "Ashthorn", "Blazebinder", "Cindervane", "Duskspark"
        ],
        heroWeights: {
            water:0,
            earth:0,
            fire:0.6,
            leadership:0.1,
            wind:0.2,
            counterEspionage:0.1,
        },
        maxImages: 24
    }],
    ['fire-warrior', {
        type:"fire",
        race:"warrior",
        weights: {
            'earth': 0.2,
            'water': 0.05,
            'fire': 0.65,
            'special': 0.1
        },
        names: [
            "Ignisblade", "Blazefury", "Cinderstrike", "Drakebrand", "Emberclash",
            "Flamewrath", "Glowhammer", "Heatbrand", "Infernoaxe", "Jetshard",
            "Kindleblade", "Lavabreaker", "Magmastrike", "Novaforge", "Obsidianblade",
            "Pyrebane", "Quickshield", "Radiantblaze", "Scorchblade", "Thermalstrike",
            "Umbraforge", "Vulcanblade", "Wildfire", "Xanthor", "Yflareblade",
            "Zephyrash", "Ashstrike", "Blazeguard", "Cinderaxe", "Duskblaze"
        ],
        heroWeights: {
            water:0,
            earth:0,
            fire:0.4,
            leadership:0.4,
            wind:0.2,
            counterEspionage:0,
        },
        maxImages: 25,
        possibleEffects: [
            "buffMeEffect",
            "removeEnemyEffectEffect",
            "attackerAdvantage"
         ]
    }],
    //Water
    ['water-witch', {
        type:"water",
        race:"witch",
        weights: {
            'earth': 0.15,
            'water': 0.5,
            'fire': 0.05,
            'special': 0.35
        },
        heroWeights: {
            water:0.5,
            earth:0.1,
            fire:0,
            leadership:0.2,
            wind:0.2,
            counterEspionage:0.1,
        },
        names: [
            "Aquarina", "Brineveil", "Coralyn", "Dewshade", "Ebbra",
            "Frostara", "Glacielle", "Hydralis", "Icelily", "Jadecrest",
            "Koralith", "Lunara", "Mistwraith", "Naiadra", "Oceara",
            "Pearlspell", "Quellara", "Ripplewhisper", "Seafrost", "Tidebinder",
            "Undinara", "Vaporlyn", "Wavecrest", "Xanthea", "Yaralune",
            "Zephyra", "Abyssara", "Brinewhisper", "Coralbreeze", "Dewspell"
        ],
        maxImages: 25,
        possibleEffects: [
            "removeEnemyEffectEffect", "buffActiveEffect", "buffMeEffect", 
            "debuffEnemyEffect", "defenderAdvantage", "attackerAdvantage"
         ]
    }],
    ['water-octopus', {
        type:"water",
        race:"octopus",
        weights: {
            'earth': 0.1,
            'water': 0.4,
            'fire': 0.1,
            'special': 0.4
        },
        heroWeights: {
            water:0.3,
            earth:0.1,
            fire:0.1,
            leadership:0.2,
            wind:0.2,
            counterEspionage:0.1,
        },
        names:  [
            "Inky", "Squiggles", "Octavius", "Cthulhu Jr.", "Bubbles", 
            "Tentacool", "Dr. Eightarms", "Wiggly", "Sushi", "Kraken", 
            "Poseidon", "Marvin", "Squishy", "Zoidberg", "Octodad", 
            "Aquarius", "Bentley", "Coraline", "Dexter", "Einstein", 
            "Floaty", "Gillbert", "Houdini", "Ivy", "Jelly", 
            "Kelp", "Leggy", "Mochi", "Noodle", "Orville", 
            "Puddles", "Quilliam", "Ripple", "Scooter", "Twirl", 
            "Umbra", "Vortex", "Whisper", "Xenon", "Yara", 
            "Zephyr", "Archie", "Blinky", "Casper", "Doodle", 
            "Echo", "Fidget", "Gumbo", "Hydra", "Izzy", 
            "Jetsam", "Kiki", "Loki", "Misty", "Nebula", 
            "Ollie", "Pip", "Quirk", "Rusty", "Sprocket", 
            "Tangle", "Ursula", "Vega", "Wobble", "Xena", 
            "Yogi", "Ziggy", "Astra", "Bubbly", "Clyde"
          ],
        maxImages: 24,
        possibleEffects: [
            "removeEnemyEffectEffect", "debuffActiveEffect",  "buffMeEffect", 
            "debuffEnemyEffect", "defenderAdvantage"
         ]
    }],
    ['water-turtle', {
        type:"water",
        race:"turtle",
        weights: {
            'earth': 0.35,
            'water': 0.55,
            'fire': 0,
            'special': 0.1
        },
        heroWeights: {
            water:0.45,
            earth:0.35,
            fire:0,
            leadership:0.1,
            wind:0.1,
            counterEspionage:0,
        },
        names: [
            "Shelly", "Crush", "Squirt", "Turbo", "Marina",  
            "Bubbles", "Coral", "Paddle", "Finn", "Nemo",  
            "Tidal", "Lagoon", "Azul", "Surf", "Waverly",  
            "Kai", "Pearl", "Sandy", "Shelldon", "Marlin",  
            "Tortuga", "Cove", "Dory", "Pebbles", "Splash",  
            "Breeze", "Cucumber", "Dune", "Ebb", "Flipper",  
            "Gill", "Honey", "Indigo", "Jade", "Kelp",  
            "Lucky", "Misty", "Nova", "Oceanus", "Poseidon",  
            "Quill", "Ripple", "Sapphire", "Tide", "Umi",  
            "Vortex", "Winston", "Xena", "Yara", "Zuma",  
            "Algae", "Barnaby", "Chip", "Dewey", "Echo",  
            "Fathom", "Glider", "Harbor", "Isla", "Jetty",  
            "Koa", "Levi", "Mango", "Nixie", "Orca",  
            "Pip", "Quest", "Reef", "Scooter", "Tango",  
            "Urchin", "Vega", "Wash", "Yoshi", "Ziggy"  
          ],
        maxImages: 25,
        possibleEffects: [
            "defenderAdvantage"
         ]
    }],
    ['fire-phoenix', {
        type:"fire",
        race:"phoenix",
        weights: {
            'earth': 0.1,
            'water': 0.1,
            'fire': 0.6,
            'special': 0.2
        },
        heroWeights: {
            water:0,
            earth:0,
            fire:0.5,
            leadership:0,
            wind:0.4,
            counterEspionage:0.1,
        },
        names: [
            "Ember", "Pyre", "Solarius", "Ignis", "Blaze",
            "Fawkes", "Ashen", "Cinder", "Solaris", "Vulcan",
            "Inferno", "Scorch", "Helios", "Rekindle", "Phoenixia",
            "Aurelian", "Flare", "Sear", "Brimstone", "Magmus",
            "Ragnarok", "Solaire", "Char", "Wildfire", "Zephyros",
            "Balthazar", "Incendius", "Radiant", "Sunflare", "Volcanis",
            "Eldrin", "Lumos", "Novaflare", "Onyxia", "Pyrrha",
            "Quicksilver", "Ravenshade", "Smolder", "Therion", "Uriel",
            "Vesuvius", "Wildspark", "Xanthe", "Yggdrasil", "Zarathos",
            "Aetheris", "Briarblaze", "Crimsonwing", "Drakon", "Ebonflame",
            "Firebrand", "Goldfeather", "Hestia", "Icarion", "Jadeflare",
            "Kaelthas", "Lavaborn", "Mythrandir", "Nirvana", "Obsidian",
            "Phaedra", "Quetzal", "Rising Dawn", "Starborn", "Tempest",
            "Undying Light", "Valkyrie", "Warbringer", "Xerxes", "Yvaine",
            "Zircon", "Aurora", "Burning Sky", "Celestia", "Dawnfire"
          ],
          possibleEffects: [
            "buffMeEffect",
            "removeEnemyEffectEffect",
            "attackerAdvantage",
            "revive"
         ],
        maxImages: 24
    }],

    ['mixed-fireWaterElemental', {
        type:"mixed",
        race:"fireWaterElemental",
        weights: {
            'earth': 0,
            'water': 0.4,
            'fire': 0.4,
            'special': 0.2
        },
        heroWeights: {
            water:0.3,
            earth:0,
            fire:0.3,
            leadership:0.1,
            wind:0.2,
            counterEspionage:0.1,
        },
        names: [
            "Pyroflux Tide", "Scorchwave", "Blazebrine", "Infernosh", "Steamspark",
            "Magmara", "Flareflow", "Torrentflare", "Hydrolight", "Cinderwash",
            "Emberglow", "Tiderupt", "Boilburst", "Vaporblaze", "Seasear",
            "Flamerip", "Sizzlespray", "Burnflow", "Scaldsurge", "Dewflare",
            "Spoutspark", "Lavalash", "Mistburn", "Geyserflare", "Blazebubble",
            "Seafire", "Tidekindle", "Floodflame", "Glowdrip", "Splashburn",
            "Brineblaze", "Frostfire", "Whirlflame", "Sprayflare", "Moltenmist",
            "Dantide", "Emberwash", "Blazewave", "Searspout", "Flamefroth",
            "Tideraze", "Vaporscorch", "Fireswell", "Hailfire", "Spoutflare",
            "Bubblesear", "Pyrospray", "Scaldspark", "Lagoonblaze", "Floodflare",
            "Sizzleswell", "Blazebrine", "Torchsurf", "Steamsear", "Flameripple",
            "Tidebrand", "Infernowash", "Glowtide", "Seaspark", "Burnishflow",
            "Sprayblaze", "Magmadrop", "Flarepool", "Searush", "Pyrotide",
            "Bubbleburn", "Flamespout", "Scaldsurge", "Vaporflame", "Tideroar",
            "Blazewash", "Frostflare", "Seaflicker"
        ],
          possibleEffects: [
            "buffMeEffect",
            "removeEnemyEffectEffect",
            "attackerAdvantage",
            "debuffActiveEffect",
            "debuffEnemyEffect",
            "buffActiveEffect"
         ],
        maxImages: 17
    }],

    ['mixed-forestDragon', {
        type:"mixed",
        race:"forestDragon",
        weights: {
            'earth': 0.4,
            'water': 0,
            'fire': 0.4,
            'special': 0.2
        },
        heroWeights: {
            water:0,
            earth:0.3,
            fire:0.3,
            leadership:0,
            wind:0.3,
            counterEspionage:0.1,
        },
        names: [
            "Verdanthorn", "Emberbough", "Sylvanclaw", "Mosscrest", "Willowflame",
            "Thornspark", "Rootfang", "Bramblewing", "Leafdrake", "Groveheart",
            "Briarback", "Fernscale", "Canopyroar", "Timberflame", "Dewclaw",
            "Vinewrath", "Oakenshade", "Petalwing", "Twilightbark", "Hollowroot",
            "Gladegaze", "Bloomfang", "Shadewhisper", "Elderflame", "Barkhide",
            "Duskthorn", "Gleamleaf", "Frostbough", "Sunroot", "Whisperbranch",
            "Sproutspire", "Mirethorn", "Hazelstorm", "Silversap", "Duskgrove",
            "Thicketmaw", "Lichenscale", "Hollowvein", "Briarflame", "Moonbark",
            "Wildshroud", "Seedspark", "Glimmerroot", "Stormleaf", "Ashenbranch",
            "Tanglemane", "Frostpetal", "Galebough", "Mistwood", "Shadowfern",
            "Dewscale", "Bramblemane", "Embervein", "Hollowthorn", "Rustlewing",
            "Grovefang", "Duskshroud", "Sapflare", "Whisperthorn", "Bloomspark",
            "Rootshade", "Thornwhisper", "Barkflame", "Silvershroud", "Mossfang",
            "Gladewing", "Vineflare", "Sunscale", "Shadethorn", "Frostvein",
            "Timbergaze", "Leafspark", "Briarwhisper", "Willowshade", "Hollowroot"
        ],
          possibleEffects: [
            "buffMeEffect",
            "removeEnemyEffectEffect",
            "attackerAdvantage",
            "defenderAdvantage",
         ],
        maxImages: 24
    }],

    ['mixed-hipo', {
        type:"mixed",
        race:"hipo",
        weights: {
            'earth': 0.45,
            'water': 0.45,
            'fire': 0,
            'special': 0.1
        },
        heroWeights: {
            water:0.4,
            earth:0.4,
            fire:0,
            leadership:0.15,
            wind:0.05,
            counterEspionage:0,
        },
        names: [
            "Gorebelly", "Mawfang", "Bogripper", "Bloodwallow", "Tuskrot",
            "Dreadmire", "Sludgehowl", "Bonecrush", "Murksnort", "Rippleshroud",
            "Carrionhoof", "Hollowtusk", "Fleshsink", "Gloomchomp", "Miregore",
            "Plaguemaw", "Soulquag", "Brackenbane", "Gulchgrin", "Rotbellow",
            "Darkslurp", "Mudmangle", "Vilewallow", "Gutstomp", "Blightback",
            "Screamriver", "Haghoof", "Gorewallow", "Terrorbog", "Shriekmire",
            "Mawshroud", "Bogfiend", "Grislegrind", "Drownfang", "Squelchflesh",
            "Tumordrool", "Havocbelly", "Scumtide", "Gloomhoof", "Wartcrush",
            "Charnelgrin", "Murkbloat", "Slaughterbath", "Bonequag", "Pustulemaw",
            "Fangmarsh", "Dreadslop", "Gutbog", "Vomitback", "Soulsludge",
            "Coffinwallow", "Gorequiver", "Miregurgle", "Hollowslop", "Blightmaw",
            "Sewerhoof", "Cursesink", "Festerbelly", "Mudcoffin", "Throatmire",
            "Rotswamp", "Terrorgulp", "Bogcarrion", "Hagmangle", "Drownmaw",
            "Shambleslurp", "Grislesink", "Plaguewallow", "Screamgrin", "Havocmire",
            "Gulchrot", "Fleshquag", "Sludgeshriek", "Brackengore", "Bloodbath"
        ],
          possibleEffects: [
            "attackerAdvantage",
            "defenderAdvantage",
         ],
        maxImages: 25
    }],

    ['mixed-natureElemental', {
        type:"mixed",
        race:"hipo",
        weights: {
            'earth': 0.3,
            'water': 0.3,
            'fire': 0.3,
            'special': 0.1
        },
        heroWeights: {
            water:0.2,
            earth:0.2,
            fire:0.2,
            leadership:0.1,
            wind:0.2,
            counterEspionage:0.1,
        },
        names: [
            "Gorebelly", "Mawfang", "Bogripper", "Bloodwallow", "Tuskrot",
            "Dreadmire", "Sludgehowl", "Bonecrush", "Murksnort", "Rippleshroud",
            "Carrionhoof", "Hollowtusk", "Fleshsink", "Gloomchomp", "Miregore",
            "Plaguemaw", "Soulquag", "Brackenbane", "Gulchgrin", "Rotbellow",
            "Darkslurp", "Mudmangle", "Vilewallow", "Gutstomp", "Blightback",
            "Screamriver", "Haghoof", "Gorewallow", "Terrorbog", "Shriekmire",
            "Mawshroud", "Bogfiend", "Grislegrind", "Drownfang", "Squelchflesh",
            "Tumordrool", "Havocbelly", "Scumtide", "Gloomhoof", "Wartcrush",
            "Charnelgrin", "Murkbloat", "Slaughterbath", "Bonequag", "Pustulemaw",
            "Fangmarsh", "Dreadslop", "Gutbog", "Vomitback", "Soulsludge",
            "Coffinwallow", "Gorequiver", "Miregurgle", "Hollowslop", "Blightmaw",
            "Sewerhoof", "Cursesink", "Festerbelly", "Mudcoffin", "Throatmire",
            "Rotswamp", "Terrorgulp", "Bogcarrion", "Hagmangle", "Drownmaw",
            "Shambleslurp", "Grislesink", "Plaguewallow", "Screamgrin", "Havocmire",
            "Gulchrot", "Fleshquag", "Sludgeshriek", "Brackengore", "Bloodbath"
        ],
          possibleEffects: [
            "attackerAdvantage",
            "defenderAdvantage",
            'buffMe',
            "revive"
         ],
        maxImages: 25
    }]

])