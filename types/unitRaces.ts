import { HeroWeights, UnitWeights } from ".";

export type UnitRaceData = {
    weights: UnitWeights;
    names: string[];
    type: string;
    race: string;
    maxImages: number;
    heroWeights?: HeroWeights;
}

type UnitRaceKey = 'earth-goat' | 'earth-golem' | 'fire-mage' | 'fire-warrior' | 'water-witch' | 'earth-forestSpirit';

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
        maxImages: 8
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
        maxImages: 8
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
        maxImages: 28
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
        maxImages: 8
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
        maxImages: 8
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
        maxImages: 8
    }]
])