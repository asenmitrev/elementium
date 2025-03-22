import { UnitType, UnitWeights } from "../../../types";
import {
  effectCostsDictionary,
  effectGeneration,
  getRandomEffectCost,
} from "../../../types/battle/effects";
import { EffectMethods } from "../../../types/battle/effectUtils";

const pointsPerLevel = 5;
const startingPoints = 15;

export const generalPointAnnotator = function (
  points: number,
  weights: Record<string, number> | UnitWeights
) {
  // Normalize the weights so that they sum to 1
  const totalWeight =
    Object.values(weights).reduce((sum, weight) => sum + weight, 0) || 1;
  const normalizedWeights = Object.fromEntries(
    Object.entries(weights).map(([key, weight]) => [key, weight / totalWeight])
  );

  // Distribute the points based on the normalized weights
  const distributedPoints = spreadWithWeights(points, normalizedWeights);

  return distributedPoints;
};

export const unitPointAnnotator = function (
  level: number,
  type: "water" | "earth" | "fire",
  customWeights?: UnitWeights
): { water: number; earth: number; fire: number; special: number } {
  const points = startingPoints + pointsPerLevel * level;

  const weightForType: UnitWeights = customWeights || {
    water: 0,
    earth: 0,
    fire: 0,
    special: 0,
  };

  if (!customWeights) {
    Object.keys(weightForType).forEach((innerType) => {
      if (innerType === type) {
        weightForType[innerType as keyof typeof weightForType] = 0.4;
      } else {
        weightForType[innerType as keyof typeof weightForType] = 0.2;
      }
    });
  }

  const [water, earth, fire, special] = generalPointAnnotator(
    points,
    weightForType
  );
  return {
    water,
    earth,
    fire,
    special,
  };
};

export const nameGeneration = function (): string {
  return "random name";
};

export const createUnitType = function (): UnitType {
  const level = 1;
  let { water, earth, fire, special } = unitPointAnnotator(level, "water");

  const { effect, remainder } = effectGeneration(special);

  if (remainder > 0) {
    const [water2, earth2, fire2] = generalPointAnnotator(remainder, {
      water2: 0.33,
      earth2: 0.33,
      fire2: 0.33,
    });
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
  // console.log('i tuk?')
  const newUnitType: UnitType = {
    water,
    earth,
    fire,
    name: nameGeneration(),
    howManyPeopleHaveIt: 0,
    level: 0,
    effect: effect,
    specialExplanation: "",
    image: "",
    evolutions: [],
  };
  // console.log(" i tuk daje?")
//  console.log(newUnitType,  water, earth)
  return newUnitType;
};

export const heroPointAnnotator = function (
  level: number,
  type: "water" | "earth" | "fire" | "leadership" | "speed" | "counterEspionage"
) {
  //How much points would the card spent
  const points = startingPoints + pointsPerLevel * level;
  const weightForType = {
    water: 0,
    earth: 0,
    fire: 0,
    leadership: 0,
    speed: 0,
    counterEspionage:0 
  };
  Object.keys(weightForType).forEach((innerType) => {
    if (innerType === type) {
      weightForType[innerType as keyof typeof weightForType] = 0.25;
    } else {
      weightForType[innerType as keyof typeof weightForType] = 0.15;
    }
  });

  //1st Water 2nd Earth 3rd Fire
  const [water, earth, fire, leadership, speed, counterEspionage] = generalPointAnnotator(
    points,
    weightForType
  );
  return {
    water,
    earth,
    fire,
    leadership,
    speed,
    counterEspionage
  };
};

function spreadWithWeights(
  total: number,
  weights: Record<string, number> = {
    water: 0.3,
    earth: 0.3,
    fire: 0.3,
    special: 0.1,
  }
) {
  total = Math.round(total);

  const weightSum = Object.values(weights).reduce((sum, w) => sum + w, 0);
  if (Math.abs(weightSum - 1) > 0.000001) {
    throw new Error("Weights must sum to 1");
  }

  const variation = 0.2; // 20% maximum variation
  const getRandomVariation = () => (Math.random() * 2 - 1) * variation;

  const categories: string[] = Object.keys(weights);
  const values: Record<string, number> = {};

  // Calculate initial values with random variation
  let remainingTotal = total;
  categories.slice(0, -1).forEach((category) => {
    values[category] = Math.round(
      total * weights[category] * (1 + getRandomVariation())
    );
    remainingTotal -= values[category];
  });

  // Assign the remaining total to the last category
  values[categories[categories.length - 1]] = remainingTotal;

  // Check if any value is out of bounds and recalculate if necessary
  const lastCategory = categories[categories.length - 1];
  const maxSpecial = total * weights[lastCategory] * 1.5;
  if (values[lastCategory] < 0 || values[lastCategory] > maxSpecial) {
    categories.slice(0, -1).forEach((category) => {
      values[category] = Math.round(total * weights[category]);
    });
    values[lastCategory] =
      total -
      categories
        .slice(0, -1)
        .reduce((sum, category) => sum + values[category], 0);
  }

  return Object.values(values);
}


console.log(createUnitType(), ' tuka?');