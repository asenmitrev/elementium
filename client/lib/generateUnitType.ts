
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

const pointsPerLevel = 5;
const startingPoints = 15;
const unitPointAnnotator = function(level,type){
    //How much points would the card spent
    const points = startingPoints + pointsPerLevel*level;
    const weightForType = {
        "water":0,
        "earth":0,
        "fire":0,
        "special":0
    }
    Object.keys(weightForType).forEach((innerType) => {
        if(innerType === type){
            weightForType[innerType] = 0.4
        }
        else{
            weightForType[innerType]= 0.2
        }
    })

    //1st Water 2nd Earth 3rd Fire
    const [water, earth, fire, special] =spreadWithWeights(points, weightForType)
    return {
        water,
        earth,
        fire,
        special
    }
}

const heroPointAnnotator = function(level,type){
    //How much points would the card spent
    const points = startingPoints + pointsPerLevel*level;
    const weightForType = {
        "water":0,
        "earth":0,
        "fire":0,
        "leadership":0,
        "speed":0
    }
    Object.keys(weightForType).forEach((innerType) => {
        if(innerType === type){
            weightForType[innerType] = 0.4
        }
        else{
            weightForType[innerType]= 0.15
        }
    })

    //1st Water 2nd Earth 3rd Fire
    const [water, earth, fire, leadership, speed] =spreadWithWeights(points, weightForType)
    return {
        water,
        earth,
        fire,
        leadership,
        speed
    }
}



function spreadWithWeights(total, weights:Object = { water: 0.3, earth: 0.3, fire: 0.3, special: 0.1 }) {
    total = Math.round(total);

    const weightSum = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (Math.abs(weightSum - 1) > 0.000001) {
        throw new Error('Weights must sum to 1');
    }

    const variation = 0.2; // 20% maximum variation
    const getRandomVariation = () => (Math.random() * 2 - 1) * variation;

    const categories = Object.keys(weights);
    const values = {};

    // Calculate initial values with random variation
    let remainingTotal = total;
    categories.slice(0, -1).forEach(category => {
        values[category] = Math.round(total * weights[category] * (1 + getRandomVariation()));
        remainingTotal -= values[category];
    });

    // Assign the remaining total to the last category
    values[categories[categories.length - 1]] = remainingTotal;

    // Check if any value is out of bounds and recalculate if necessary
    const lastCategory = categories[categories.length - 1];
    const maxSpecial = total * weights[lastCategory] * 1.5;
    if (values[lastCategory] < 0 || values[lastCategory] > maxSpecial) {
        categories.slice(0, -1).forEach(category => {
            values[category] = Math.round(total * weights[category]);
        });
        values[lastCategory] = total - categories.slice(0, -1).reduce((sum, category) => sum + values[category], 0);
    }

    return Object.values(values);
}

console.log(unitPointAnnotator(5,"water"))
console.log(heroPointAnnotator(5,"water"))
