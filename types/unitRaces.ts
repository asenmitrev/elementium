export const unitRaces = new Map([
    ['earth-goat', {
        maxNumber:1,
        weights: {
            'earth':0.4,
            'water':0.25,
            'fire':0.05,
            'special':0.3
        },
        specialWeights: {
            //Koi kakvi speciali mogat da mu se padat
        }
    }],
    ['earth-golem', {
        maxNumber:5,
        weights: {
            'earth':0.6,
            'water':0.2,
            'fire':0.15,
            'special':0.05
        },
        specialWeights: {}
    }],
    ['fire-mage', {
        maxNumber:1,
        weights: {
            'earth':0.1,
            'water':0.05,
            'fire':0.5,
           'special':0.35
        },
        specialWeights: {}
    }],
    ['fire-warrior', {
        maxNumber:1,
        weights: {
            'earth':0.2,
            'water':0.05,
            'fire':0.65,
            'special':0.1
        },
        specialWeights: {}
    }],
    ['water-witch', {
        maxNumber:2,
        weights: {
            'earth':0.15,
            'water':0.5,
            'fire':0.05,
            'special':0.35
        },
        specialWeights: {}
    }],
])

function generateStringWithRandomNumber(baseString: string, maxNumber: number): string {
    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    return `${baseString}-${randomNumber}`;
}
