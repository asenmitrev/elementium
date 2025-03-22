"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroPointAnnotator = exports.createUnitType = exports.nameGeneration = exports.unitPointAnnotator = exports.generalPointAnnotator = void 0;
var effects_1 = require("../../../types/battle/effects");
var pointsPerLevel = 5;
var startingPoints = 15;
var generalPointAnnotator = function (points, weights) {
    // Normalize the weights so that they sum to 1
    var totalWeight = Object.values(weights).reduce(function (sum, weight) { return sum + weight; }, 0) || 1;
    var normalizedWeights = Object.fromEntries(Object.entries(weights).map(function (_a) {
        var key = _a[0], weight = _a[1];
        return [key, weight / totalWeight];
    }));
    // Distribute the points based on the normalized weights
    var distributedPoints = spreadWithWeights(points, normalizedWeights);
    return distributedPoints;
};
exports.generalPointAnnotator = generalPointAnnotator;
var unitPointAnnotator = function (level, type, customWeights) {
    var points = startingPoints + pointsPerLevel * level;
    var weightForType = customWeights || {
        water: 0,
        earth: 0,
        fire: 0,
        special: 0,
    };
    if (!customWeights) {
        Object.keys(weightForType).forEach(function (innerType) {
            if (innerType === type) {
                weightForType[innerType] = 0.4;
            }
            else {
                weightForType[innerType] = 0.2;
            }
        });
    }
    var _a = (0, exports.generalPointAnnotator)(points, weightForType), water = _a[0], earth = _a[1], fire = _a[2], special = _a[3];
    return {
        water: water,
        earth: earth,
        fire: fire,
        special: special,
    };
};
exports.unitPointAnnotator = unitPointAnnotator;
var nameGeneration = function () {
    return "random name";
};
exports.nameGeneration = nameGeneration;
var createUnitType = function () {
    console.log('vliza?');
    var level = 1;
    var _a = (0, exports.unitPointAnnotator)(level, "water"), water = _a.water, earth = _a.earth, fire = _a.fire, special = _a.special;
    var _b = (0, effects_1.effectGeneration)(special), effect = _b.effect, remainder = _b.remainder;
    if (remainder > 0) {
        var _c = (0, exports.generalPointAnnotator)(remainder, {
            water2: 0.33,
            earth2: 0.33,
            fire2: 0.33,
        }), water2 = _c[0], earth2 = _c[1], fire2 = _c[2];
        water += water2;
        earth += earth2;
        fire += fire2;
        // Use the distributed points here if needed
    }
    /*
          Weights Generation,
          Name Generation,
          Image Generation,
          Effect Generation,
          Evolutions Generation
      */
    var newUnitType = {
        water: water,
        earth: earth,
        fire: fire,
        name: (0, exports.nameGeneration)(),
        howManyPeopleHaveIt: 0,
        level: 0,
        effect: effect,
        specialExplanation: "",
        image: "",
        evolutions: [],
    };
    console.log(newUnitType, water, earth);
    return newUnitType;
};
exports.createUnitType = createUnitType;
var heroPointAnnotator = function (level, type) {
    //How much points would the card spent
    var points = startingPoints + pointsPerLevel * level;
    var weightForType = {
        water: 0,
        earth: 0,
        fire: 0,
        leadership: 0,
        speed: 0,
        counterEspionage: 0
    };
    Object.keys(weightForType).forEach(function (innerType) {
        if (innerType === type) {
            weightForType[innerType] = 0.25;
        }
        else {
            weightForType[innerType] = 0.15;
        }
    });
    //1st Water 2nd Earth 3rd Fire
    var _a = (0, exports.generalPointAnnotator)(points, weightForType), water = _a[0], earth = _a[1], fire = _a[2], leadership = _a[3], speed = _a[4], counterEspionage = _a[5];
    return {
        water: water,
        earth: earth,
        fire: fire,
        leadership: leadership,
        speed: speed,
        counterEspionage: counterEspionage
    };
};
exports.heroPointAnnotator = heroPointAnnotator;
function spreadWithWeights(total, weights) {
    if (weights === void 0) { weights = {
        water: 0.3,
        earth: 0.3,
        fire: 0.3,
        special: 0.1,
    }; }
    total = Math.round(total);
    var weightSum = Object.values(weights).reduce(function (sum, w) { return sum + w; }, 0);
    if (Math.abs(weightSum - 1) > 0.000001) {
        throw new Error("Weights must sum to 1");
    }
    var variation = 0.2; // 20% maximum variation
    var getRandomVariation = function () { return (Math.random() * 2 - 1) * variation; };
    var categories = Object.keys(weights);
    var values = {};
    // Calculate initial values with random variation
    var remainingTotal = total;
    categories.slice(0, -1).forEach(function (category) {
        values[category] = Math.round(total * weights[category] * (1 + getRandomVariation()));
        remainingTotal -= values[category];
    });
    // Assign the remaining total to the last category
    values[categories[categories.length - 1]] = remainingTotal;
    // Check if any value is out of bounds and recalculate if necessary
    var lastCategory = categories[categories.length - 1];
    var maxSpecial = total * weights[lastCategory] * 1.5;
    if (values[lastCategory] < 0 || values[lastCategory] > maxSpecial) {
        categories.slice(0, -1).forEach(function (category) {
            values[category] = Math.round(total * weights[category]);
        });
        values[lastCategory] =
            total -
                categories
                    .slice(0, -1)
                    .reduce(function (sum, category) { return sum + values[category]; }, 0);
    }
    return Object.values(values);
}
console.log((0, exports.createUnitType)());
