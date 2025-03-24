import { UnitWeights } from ".";

export type UnitRaceData = {
    weights: UnitWeights;
    names: string[];
    type: string;
    race: string;
    maxImages: number;
}

type UnitRaceKey = 'earth-goat' | 'earth-golem' | 'fire-mage' | 'fire-warrior' | 'water-witch';

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
        maxImages: 8
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
function generateStringWithRandomNumber(baseString: string, maxNumber: number): string {
    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    return `${baseString}-${randomNumber}`;
}
